import { Message as MessageType } from "@/types/chat";
import { InvoiceCard } from "./InvoiceCard";

interface MessageProps {
    message: MessageType;
}

export function Message({ message }: MessageProps) {
    const isUser = message.sender === "user";

    const formatTime = (timestamp?: Date) => {
        if (!timestamp) return "";
        return timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className={`text-sm ${isUser ? "text-right text-blue-600" : "text-left text-gray-700"}`}>
            <div className="flex items-center gap-2 mb-1">
                <span className="block font-semibold">{isUser ? "You" : "Bot"}:</span>
                {message.timestamp && (
                    <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                )}
            </div>

            {message.invoices ? (
                <div className="space-y-4">
                    {message.invoices.map((invoice) => (
                        <InvoiceCard key={invoice.id} invoice={invoice} />
                    ))}
                </div>
            ) : (
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
            )}
        </div>
    );
}
