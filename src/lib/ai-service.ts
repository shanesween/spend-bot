import { OpenAI } from "openai";
import { AGENT_CONFIG, AGENT_FUNCTIONS } from "./agent-config";

/**
 * AI Service for handling OpenAI interactions
 * Separates AI orchestration logic from business logic
 */

// Initialize OpenAI client with API key from environment variables
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export interface AIResponse {
    content: string | null;
    functionCall?: {
        name: string;
        arguments: string;
    };
}

/**
 * Send a prompt to the AI and get response with potential function calls
 * @param prompt - User's natural language request
 * @returns Promise<AIResponse> - AI response with optional function call
 */
export async function getAIResponse(prompt: string): Promise<AIResponse> {
    const response = await openai.chat.completions.create({
        model: AGENT_CONFIG.model,
        messages: [
            { role: "system", content: AGENT_CONFIG.systemPrompt },
            { role: "user", content: prompt },
        ],
        tools: AGENT_FUNCTIONS.map((fn) => ({ type: "function", function: fn })),
        tool_choice: "auto", // Let AI decide whether to use tools or respond directly
    });

    const message = response.choices[0].message;
    const toolCall = message.tool_calls?.[0];

    if (!toolCall) {
        return {
            content: message.content,
        };
    }

    return {
        content: message.content,
        functionCall: {
            name: toolCall.function.name,
            arguments: toolCall.function.arguments || "{}",
        },
    };
} 