import stripe from "./stripe";
import { InvoiceSummary, InteractiveMessage, PaymentMethod } from "@/types/chat";

/**
 * Stripe function implementations for the AI agent
 * These functions handle the actual business logic for financial operations
 */

/**
 * List unpaid invoices for the user
 * @returns Promise<InvoiceSummary[]> - Array of unpaid invoice summaries
 */
export async function listUnpaidInvoices(): Promise<InvoiceSummary[]> {
    const invoices = await stripe.invoices.list({
        status: "open",
        customer: process.env.STRIPE_CUSTOMER_ID,
        limit: 5,
    });

    return invoices.data.map((invoice) => ({
        id: invoice.id || "",
        number: invoice.number || "",
        total: invoice.total,
        currency: invoice.currency,
        status: invoice.status || "unknown",
        due_date: invoice.due_date,
        description: invoice.description || "(No description)",
        customer_email: invoice.customer_email || undefined,
        hosted_invoice_url: invoice.hosted_invoice_url || undefined,
        account_name: invoice.account_name || undefined,
    }));
}

/**
 * Pay an invoice by ID
 * @param invoiceId - The ID of the invoice to pay
 * @returns Promise<string> - Success message with payment details or error requiring payment method setup
 */
export async function payInvoice(invoiceId: string): Promise<string> {
    try {
        const paid = await stripe.invoices.pay(invoiceId);

        return `✅ Invoice ${paid.id} paid successfully for ${paid.amount_paid / 100} ${paid.currency.toUpperCase()}`;

    } catch (error: unknown) {
        // Check if the error is due to missing payment method
        if (error instanceof Error && error.message.includes('default_payment_method')) {
            throw new Error('NO_PAYMENT_METHOD');
        }
        return `❌ Error paying invoice ${invoiceId}: ${error}`;
    }
}

/**
 * Initiate an interactive payment flow
 * @returns Promise<InteractiveMessage> - Interactive message for invoice selection
 */
export async function initiatePaymentFlow(): Promise<InteractiveMessage> {
    const invoices = await listUnpaidInvoices();

    if (invoices.length === 0) {
        throw new Error("No unpaid invoices found");
    }

    return {
        type: 'invoice_selection',
        invoices: invoices
    };
}

/**
 * Create a Setup Intent for collecting payment methods
 * @returns Promise<string> - Client secret for the Setup Intent
 */
export async function createSetupIntent(): Promise<string> {
    const customerId = process.env.STRIPE_CUSTOMER_ID;
    if (!customerId) {
        throw new Error("Customer ID not configured");
    }

    const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: ['card'],
        usage: 'off_session',
        metadata: {
            purpose: 'default_payment_method'
        }
    });

    return setupIntent.client_secret!;
}

/**
 * List payment methods for the customer
 * @returns Promise<PaymentMethod[]> - Array of payment methods
 */
export async function listPaymentMethods(): Promise<PaymentMethod[]> {
    const customerId = process.env.STRIPE_CUSTOMER_ID;
    if (!customerId) {
        throw new Error("Customer ID not configured");
    }

    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
    });

    return paymentMethods.data.map(pm => ({
        id: pm.id,
        type: pm.type,
        card: pm.card ? {
            brand: pm.card.brand,
            last4: pm.card.last4,
            exp_month: pm.card.exp_month,
            exp_year: pm.card.exp_year,
        } : undefined,
        created: pm.created,
    }));
}

/**
 * Set a payment method as default for the customer
 * @param paymentMethodId - The ID of the payment method to set as default
 * @returns Promise<string> - Success message
 */
export async function setDefaultPaymentMethod(paymentMethodId: string): Promise<string> {
    const customerId = process.env.STRIPE_CUSTOMER_ID;
    if (!customerId) {
        throw new Error("Customer ID not configured");
    }

    await stripe.customers.update(customerId, {
        invoice_settings: {
            default_payment_method: paymentMethodId,
        },
    });

    return `✅ Payment method set as default successfully`;
}

/**
 * Initiate payment method setup flow
 * @returns Promise<InteractiveMessage> - Interactive message for payment method setup
 */
export async function initiatePaymentMethodSetup(): Promise<InteractiveMessage> {
    const clientSecret = await createSetupIntent();

    return {
        type: 'payment_method_setup',
        setupIntentClientSecret: clientSecret
    };
} 