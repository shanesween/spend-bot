export interface InvoiceSummary {
    id: string;
    number: string;
    total: number;
    currency: string;
    status: string;
    due_date?: number | null;
    description: string;
    customer_email?: string;
    hosted_invoice_url?: string;
    account_name?: string;
}

// Interactive flow types
export interface InteractiveAction {
    type: 'select_invoice' | 'confirm_payment' | 'cancel_flow';
    data?: {
        invoiceId?: string;
        [key: string]: unknown;
    };
}

export interface InteractiveMessage {
    type: 'invoice_selection' | 'payment_confirmation';
    invoices?: InvoiceSummary[];
    selectedInvoice?: InvoiceSummary;
    onAction?: (action: InteractiveAction) => void;
}

export interface Message {
    sender: "user" | "bot";
    content?: string; // still used for user messages or fallback bot replies
    invoices?: InvoiceSummary[]; // added for bot responses
    interactive?: InteractiveMessage; // new field for interactive flows
    timestamp?: Date;
    id?: string;
}

export interface ChatResponse {
    result: string;
    error?: string;
    interactive?: InteractiveMessage; // support for interactive responses
} 