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

export interface PaymentMethod {
    id: string;
    type: string;
    card?: {
        brand: string;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
    created: number;
}

// Interactive flow types
export interface InteractiveAction {
    type: 'select_invoice' | 'confirm_payment' | 'cancel_flow' | 'setup_payment_method' | 'select_payment_method' | 'set_default_payment_method';
    data?: {
        invoiceId?: string;
        paymentMethodId?: string;
        setupIntentClientSecret?: string;
        [key: string]: unknown;
    };
}

export interface InteractiveMessage {
    type: 'invoice_selection' | 'payment_confirmation' | 'payment_method_setup' | 'payment_method_selection';
    invoices?: InvoiceSummary[];
    selectedInvoice?: InvoiceSummary;
    paymentMethods?: PaymentMethod[];
    setupIntentClientSecret?: string;
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