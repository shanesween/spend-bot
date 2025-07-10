import { runSpendAgent } from "@/lib/agent";
import { payInvoice, listUnpaidInvoices, setDefaultPaymentMethod, createSetupIntent } from "@/lib/functions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { prompt, action } = await req.json();

    // Handle interactive actions
    if (action) {
        try {
            switch (action.type) {
                case "select_invoice":
                    const invoiceId = action.data?.invoiceId;
                    if (!invoiceId) {
                        return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
                    }

                    // Get invoice details for confirmation
                    const invoices = await listUnpaidInvoices();
                    const selectedInvoice = invoices.find(inv => inv.id === invoiceId);

                    if (!selectedInvoice) {
                        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
                    }

                    return NextResponse.json({
                        result: "Please confirm the payment details:",
                        interactive: {
                            type: 'payment_confirmation',
                            selectedInvoice: selectedInvoice
                        }
                    });

                case "confirm_payment":
                    const paymentInvoiceId = action.data?.invoiceId;
                    if (!paymentInvoiceId) {
                        return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
                    }

                    try {
                        const paymentResult = await payInvoice(paymentInvoiceId);
                        return NextResponse.json({ result: paymentResult });
                    } catch (error) {
                        if (error instanceof Error && error.message === 'NO_PAYMENT_METHOD') {
                            try {
                                // Create a real Setup Intent for payment method collection
                                const clientSecret = await createSetupIntent();
                                return NextResponse.json({
                                    result: "You need to add a payment method first. Let's set that up:",
                                    interactive: {
                                        type: 'payment_method_setup',
                                        setupIntentClientSecret: clientSecret
                                    }
                                });
                            } catch (setupError) {
                                console.error('Error creating Setup Intent:', setupError);
                                return NextResponse.json({
                                    error: "Failed to initialize payment method setup. Please check your Stripe configuration."
                                }, { status: 500 });
                            }
                        }
                        throw error;
                    }

                case "setup_payment_method":
                    const paymentMethodId = action.data?.paymentMethodId;
                    if (!paymentMethodId) {
                        return NextResponse.json({ error: "Payment method ID is required" }, { status: 400 });
                    }

                    try {
                        // Set the payment method as default for the customer
                        await setDefaultPaymentMethod(paymentMethodId);

                        return NextResponse.json({
                            result: "🎉 Payment method added successfully! Your card has been securely saved and set as your default payment method. You can now pay your invoices. Would you like to try paying an invoice now?"
                        });
                    } catch (error) {
                        console.error('Error setting default payment method:', error);
                        return NextResponse.json({
                            result: "⚠️ Payment method was set up but there was an issue setting it as default. You can still use it to pay invoices."
                        });
                    }

                case "cancel_flow":
                    return NextResponse.json({ result: "Operation cancelled." });

                default:
                    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
            }
        } catch (err) {
            console.error("Error handling interactive action:", err);
            return NextResponse.json({ error: "Failed to process action" }, { status: 500 });
        }
    }

    // Handle regular prompts
    if (!prompt) return NextResponse.json({ error: "Missing prompt" }, { status: 400 });

    try {
        const agentResponse = await runSpendAgent(prompt);
        return NextResponse.json({
            result: agentResponse.content || "",
            interactive: agentResponse.interactive
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to run agent" }, { status: 500 });
    }
}
