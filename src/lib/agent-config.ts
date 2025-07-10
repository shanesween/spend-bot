/**
 * Configuration for the AI financial agent
 * Contains function definitions, system prompts, and model settings
 */

export const AGENT_CONFIG = {
    model: "gpt-3.5-turbo",
    systemPrompt: `You're a finance assistant that helps users spend money and manage their payment methods. 

When a user asks to "Pay an invoice" or similar phrases, you should use the "initiate_payment_flow" function to start an interactive payment process.

When a user wants to manage payment methods, use the "list_payment_methods" function to show their current payment methods, or "setup_payment_method" to help them add a new one.

For other queries about invoices, use the appropriate functions to list or pay specific invoices.

Be helpful and guide users through the payment process step by step.`,
} as const;

/**
 * Function definitions for OpenAI function calling
 * These define what tools the AI has access to
 */
export const AGENT_FUNCTIONS = [
    {
        name: "list_unpaid_invoices",
        description: "List open invoices for the user",
        parameters: {
            type: "object",
            properties: {}, // No parameters needed for listing invoices
        },
    },
    {
        name: "pay_invoice",
        description: "Pay an invoice by ID",
        parameters: {
            type: "object",
            properties: {
                invoiceId: {
                    type: "string",
                    description: "The ID of the invoice to pay",
                },
            },
            required: ["invoiceId"], // invoiceId is required for payment
        },
    },
    {
        name: "initiate_payment_flow",
        description: "Start an interactive payment flow where the user can select an invoice to pay",
        parameters: {
            type: "object",
            properties: {}, // No parameters needed for starting the flow
        },
    },
    {
        name: "list_payment_methods",
        description: "List all payment methods for the user",
        parameters: {
            type: "object",
            properties: {}, // No parameters needed for listing payment methods
        },
    },
    {
        name: "setup_payment_method",
        description: "Start the process to add a new payment method",
        parameters: {
            type: "object",
            properties: {}, // No parameters needed for starting setup
        },
    },
] as const; 