/**
 * AI Agent for Financial Management
 * 
 * This module implements an AI-powered financial assistant that can:
 * - List unpaid invoices from Stripe
 * - Process invoice payments
 * - Provide natural language responses about financial data
 * 
 * Uses OpenAI's function calling feature to execute specific financial operations
 * based on user prompts.
 */

import { OpenAI } from "openai";
import stripe from "./stripe";

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Main function to run the AI financial agent
 * 
 * @param prompt - User's natural language request (e.g., "Show me my unpaid invoices")
 * @returns Promise<string> - AI response or result of executed function
 */
export async function runSpendAgent(prompt: string) {
    // Define available functions that the AI can call
    // These are the "tools" the AI has access to for financial operations
    const functions = [
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
    ];

    // Send request to OpenAI with function calling enabled
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Using GPT-3.5 for cost efficiency
        messages: [
            // System message defines the AI's role and behavior
            { role: "system", content: "You're a finance assistant that helps users spend money." },
            // User message contains the actual request
            { role: "user", content: prompt },
        ],
        // Convert our function definitions to OpenAI's tool format
        tools: functions.map((fn) => ({ type: "function", function: fn })),
        tool_choice: "auto", // Let AI decide whether to use tools or respond directly
    });

    // Check if the AI decided to call a function
    const toolCall = response.choices[0].message.tool_calls?.[0];
    if (!toolCall) {
        // If no function was called, return the AI's direct response
        return response.choices[0].message.content;
    }

    // Extract function name and arguments from the AI's tool call
    const { name, arguments: argsJSON } = toolCall.function;
    const args = JSON.parse(argsJSON || "{}");

    // Execute the appropriate function based on the AI's choice
    if (name === "list_unpaid_invoices") {
        // Fetch open invoices from Stripe (limited to 5 for performance)
        const invoices = await stripe.invoices.list({
            status: "open",
            // TODO: get customer id from stripe dynamically
            customer: process.env.STRIPE_CUSTOMER_ID,
            limit: 5,
        });

        // Return formatted invoice data as JSON string
        // Stripe amounts are in cents, so we keep them as-is for now
        return JSON.stringify(invoices.data.map((i) => ({
            id: i.id,
            total: i.total,
            description: i.description
        })));
    }

    if (name === "pay_invoice") {
        // Process payment for the specified invoice
        const paid = await stripe.invoices.pay(args.invoiceId);

        // Return success message with payment details
        // Convert cents to dollars for display (amount_paid is in cents)
        return `Invoice ${paid.id} paid successfully for ${paid.amount_paid / 100} ${paid.currency.toUpperCase()}`;
    }

    // Fallback for unknown function calls
    return "No matching tool found.";
}
