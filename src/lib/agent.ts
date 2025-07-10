/**
 * AI Agent for Financial Management
 * 
 * This module orchestrates the AI-powered financial assistant that can:
 * - List unpaid invoices from Stripe
 * - Process invoice payments
 * - Initiate interactive payment flows
 * - Provide natural language responses about financial data
 * 
 * Uses OpenAI's function calling feature to execute specific financial operations
 * based on user prompts.
 */

import { getAIResponse } from "./ai-service";
import { listUnpaidInvoices, payInvoice, initiatePaymentFlow } from "./functions";
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
                const paymentResult = await payInvoice(args.invoiceId);
                return {
                    content: paymentResult
                };

            case "initiate_payment_flow":
                const interactiveFlow = await initiatePaymentFlow();
                return {
                    content: "Please select an invoice to pay:",
                    interactive: interactiveFlow
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
