import { useState, useEffect, useCallback } from "react";
import { Message, ChatResponse } from "@/types/chat";
import { CHAT_CONSTANTS } from "@/constants/chat";

export function useChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Load messages from localStorage on mount
    useEffect(() => {
        const savedMessages = localStorage.getItem('chat-messages');
        if (savedMessages) {
            try {
                const parsedMessages = JSON.parse(savedMessages) as Array<Message & { timestamp?: string }>;
                // Convert timestamp strings back to Date objects
                const messagesWithDates = parsedMessages.map((msg) => ({
                    ...msg,
                    timestamp: msg.timestamp ? new Date(msg.timestamp) : undefined
                }));
                setMessages(messagesWithDates);
            } catch (e) {
                console.error('Failed to parse saved messages:', e);
            }
        }
    }, []);

    // Save messages to localStorage when they change
    useEffect(() => {
        localStorage.setItem('chat-messages', JSON.stringify(messages));
    }, [messages]);

    const sendMessage = useCallback(async (prompt: string) => {
        if (!prompt.trim()) return;

        const timestamp = new Date();
        const userMessage: Message = {
            sender: "user",
            content: prompt,
            timestamp,
            id: crypto.randomUUID()
        };

        setMessages(prev => [...prev, userMessage]);
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(CHAT_CONSTANTS.API_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data: ChatResponse = await res.json();

            const botMessage: Message = {
                sender: "bot",
                content: data.result,
                timestamp: new Date(),
                id: crypto.randomUUID()
            };

            setMessages(prev => [...prev, botMessage]);
            setError(null);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Unknown error";
            setError(errorMessage);

            const errorBotMessage: Message = {
                sender: "bot",
                content: `${CHAT_CONSTANTS.ERROR_MESSAGE}: ${errorMessage}`,
                timestamp: new Date(),
                id: crypto.randomUUID()
            };

            setMessages(prev => [...prev, errorBotMessage]);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
        localStorage.removeItem('chat-messages');
    }, []);

    return {
        messages,
        loading,
        error,
        sendMessage,
        clearMessages
    };
} 