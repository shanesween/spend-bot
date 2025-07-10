/**
 * AI Agent for Financial Management
 * 
 * This module orchestrates the AI-powered financial assistant that can:
 * - List unpaid invoices from Stripe
 * - Process invoice payments
 * - Initiate interactive payment flows
 * - Manage payment methods
 * - Provide natural language responses about financial data
 * 
 * Uses OpenAI's function calling feature to execute specific financial operations
 * based on user prompts.
 */

import { getAIResponse } from "./ai-service";
import {
    listUnpaidInvoices,
    payInvoice,
    initiatePaymentFlow,
    listPaymentMethods,
    initiatePaymentMethodSetup
} from "./functions";
import { InteractiveMessage } from "@/types/chat";

export interface AgentResponse {
    content?: string;
    interactive?: InteractiveMessage;
}

/**
 * Main function to run the AI financial agent
 * 
 * @param prompt - User's natural language request (e.g., "Show me my unpaid invoices")
 * @returns Promise<AgentResponse> - AI response or result of executed function
 */
export async function runSpendAgent(prompt: string): Promise<AgentResponse> {
    console.log("🚀 ~ runSpendAgent ~ prompt:", prompt)
    try {
        // Get AI response with potential function calls
        const aiResponse = await getAIResponse(prompt);

        // If no function was called, return the AI's direct response
        if (!aiResponse.functionCall) {
            return {
                content: aiResponse.content || "No response from AI."
            };
        }

        // Parse function arguments
        const args = JSON.parse(aiResponse.functionCall.arguments);

        // Execute the appropriate function based on the AI's choice
        switch (aiResponse.functionCall.name) {
            case "list_unpaid_invoices":
                const invoices = await listUnpaidInvoices();
                return {
                    content: JSON.stringify(invoices, null, 2)
                };

            case "pay_invoice":
                if (!args.invoiceId) {
                    return {
                        content: "Error: Invoice ID is required for payment."
                    };
                }
                try {
                    const paymentResult = await payInvoice(args.invoiceId);
                    return {
                        content: paymentResult
                    };
                } catch (error) {
                    if (error instanceof Error && error.message === 'NO_PAYMENT_METHOD') {
                        // Initiate payment method setup flow
                        const setupFlow = await initiatePaymentMethodSetup();
                        return {
                            content: "You need to add a payment method first. Let's set that up:",
                            interactive: setupFlow
                        };
                    }
                    throw error;
                }

            case "initiate_payment_flow":
                const interactiveFlow = await initiatePaymentFlow();
                return {
                    content: "Please select an invoice to pay:",
                    interactive: interactiveFlow
                };

            case "list_payment_methods":
                const paymentMethods = await listPaymentMethods();
                if (paymentMethods.length === 0) {
                    return {
                        content: "You don't have any payment methods set up yet. Would you like to add one?"
                    };
                }
                return {
                    content: `You have ${paymentMethods.length} payment method(s):\n\n` +
                        paymentMethods.map(pm =>
                            `• ${pm.card?.brand.toUpperCase()} ending in ${pm.card?.last4} (expires ${pm.card?.exp_month}/${pm.card?.exp_year})`
                        ).join('\n')
                };

            case "setup_payment_method":
                const setupFlow = await initiatePaymentMethodSetup();
                return {
                    content: "Let's add a new payment method:",
                    interactive: setupFlow
                };

            default:
                return {
                    content: "No matching tool found."
                };
        }
    } catch (error) {
        console.error("Error in runSpendAgent:", error);
        return {
            content: "Sorry, I encountered an error processing your request."
        };
    }
}
