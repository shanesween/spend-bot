import { runSpendAgent } from "@/lib/agent";
import { payInvoice, listUnpaidInvoices } from "@/lib/functions";
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

                    const paymentResult = await payInvoice(paymentInvoiceId);
                    return NextResponse.json({ result: paymentResult });

                case "cancel_flow":
                    return NextResponse.json({ result: "Payment cancelled." });

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
