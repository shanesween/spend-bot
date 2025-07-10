import stripe from "./stripe";
import { InvoiceSummary, InteractiveMessage } from "@/types/chat";

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
 * @returns Promise<string> - Success message with payment details
 */
export async function payInvoice(invoiceId: string): Promise<string> {
    try {
        const paid = await stripe.invoices.pay(invoiceId);

        return `Invoice ${paid.id} paid successfully for ${paid.amount_paid / 100} ${paid.currency.toUpperCase()}`;

    } catch (error) {
        return `Error paying invoice ${invoiceId}: ${error}`
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