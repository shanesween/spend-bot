"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "./Message";
import { useChat } from "@/hooks/useChat";
import { CHAT_CONSTANTS } from "@/constants/chat";
import { toast } from "sonner";
import { Loader2Icon } from "lucide-react"

export default function ChatUI() {
    const [prompt, setPrompt] = useState("");
    const { messages, loading, error, sendMessage, clearMessages } = useChat();
    const bottomRef = useRef<HTMLDivElement>(null);

    const handleSend = useCallback(async () => {
        const trimmedPrompt = prompt.trim();

        if (!trimmedPrompt) return;
        if (trimmedPrompt.length > CHAT_CONSTANTS.MAX_MESSAGE_LENGTH) {
            toast("Message is too long. Please keep it under 1000 characters.");
            return;
        }

        await sendMessage(trimmedPrompt);
        setPrompt("");
    }, [prompt, sendMessage]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }, [handleSend]);

    // Scroll to bottom when messages update
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">💸 Spend Bot</h1>
                {messages.length > 0 && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearMessages}
                        aria-label="Clear chat history"
                    >
                        Clear Chat
                    </Button>
                )}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    <strong>Error:</strong> {error}
                </div>
            )}

            <Card className="h-[400px] overflow-hidden">
                <CardContent className="p-4 h-full">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                            {messages.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <p>Start a conversation with your AI financial assistant!</p>
                                    <p className="text-sm mt-2">Try asking: &ldquo;Show me my unpaid invoices&rdquo;</p>
                                </div>
                            ) : (
                                messages.map((message) => (
                                    <Message key={message.id} message={message} />
                                ))
                            )}
                            <div ref={bottomRef} />
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Input
                    value={prompt}
                    placeholder={CHAT_CONSTANTS.PLACEHOLDER_TEXT}
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={loading}
                    aria-label="Chat message input"
                    aria-describedby="send-button"
                    maxLength={CHAT_CONSTANTS.MAX_MESSAGE_LENGTH}
                />
                <Button
                    onClick={handleSend}
                    disabled={loading || !prompt.trim()}
                    id="send-button"
                    aria-label={loading ? "Sending message..." : "Send message"}
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2Icon className="animate-spin" />
                            Sending...
                        </div>
                    ) : (
                        "Send"
                    )}
                </Button>
            </div>

            {prompt.length > CHAT_CONSTANTS.MAX_MESSAGE_LENGTH * 0.8 && (
                <div className="text-xs text-gray-500 text-right">
                    {prompt.length}/{CHAT_CONSTANTS.MAX_MESSAGE_LENGTH} characters
                </div>
            )}
        </div>
    );
}
