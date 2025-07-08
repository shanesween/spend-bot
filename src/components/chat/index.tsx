"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ChatUI() {
    const [prompt, setPrompt] = useState("");
    const [messages, setMessages] = useState<{ sender: "user" | "bot"; content: string }[]>([]);
    const [loading, setLoading] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (!prompt.trim()) return;

        setMessages(prev => [...prev, { sender: "user", content: prompt }]);
        setPrompt("");
        setLoading(true);

        try {
            const res = await fetch("/api/agent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt }),
            });
            const data = await res.json();
            setMessages(prev => [...prev, { sender: "bot", content: data.result }]);
        } catch {
            setMessages(prev => [...prev, { sender: "bot", content: "⚠️ Error: Failed to get response" }]);
        }

        setLoading(false);
    };

    // Scroll to bottom when messages update
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <h1 className="text-2xl font-bold">💸 Spend Bot</h1>

            <Card className="h-[400px] overflow-hidden">
                <CardContent className="p-4 h-full">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-4">
                            {messages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`text-sm whitespace-pre-wrap ${msg.sender === "user" ? "text-right text-blue-600" : "text-left text-gray-700"
                                        }`}
                                >
                                    <span className="block font-semibold">{msg.sender === "user" ? "You" : "Bot"}:</span>
                                    {msg.content}
                                </div>
                            ))}
                            <div ref={bottomRef} />
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <div className="flex gap-2">
                <Input
                    value={prompt}
                    placeholder="Ask something like 'Pay my latest invoice'"
                    onChange={e => setPrompt(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleSend()}
                    disabled={loading}
                />
                <Button onClick={handleSend} disabled={loading}>
                    {loading ? "..." : "Send"}
                </Button>
            </div>
        </div>
    );
}
