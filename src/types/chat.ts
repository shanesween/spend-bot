export interface InvoiceSummary {
    id: string;
    number: string;
    total: number;
    currency: string;
    status: string;
    due_date: number | null;
    description: string;
    customer_email: string;
    hosted_invoice_url: string;
    account_name: string;
}

export interface Message {
    sender: "user" | "bot";
    content?: string; // still used for user messages or fallback bot replies
    invoices?: InvoiceSummary[]; // added for bot responses
    timestamp?: Date;
    id?: string;
}

export interface ChatResponse {
    result: string;
    error?: string;
} 