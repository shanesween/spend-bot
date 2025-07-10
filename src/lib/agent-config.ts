/**
 * Configuration for the AI financial agent
 * Contains function definitions, system prompts, and model settings
 */

export const AGENT_CONFIG = {
    model: "gpt-3.5-turbo",
    systemPrompt: `You're a finance assistant that helps users spend money. 
    
When a user asks to "Pay an invoice" or similar phrases, you should use the "initiate_payment_flow" function to start an interactive payment process.

For other queries about invoices, use the appropriate functions to list or pay specific invoices.`,
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
] as const; 