import { Message as MessageType } from "@/types/chat";

interface MessageProps {
    message: MessageType;
}

export function Message({ message }: MessageProps) {
    const isUser = message.sender === "user";

    const formatTime = (timestamp?: Date) => {
        if (!timestamp) return "";
        return timestamp.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`text-sm whitespace-pre-wrap ${isUser ? "text-right text-blue-600" : "text-left text-gray-700"
            }`}>
            <div className="flex items-center gap-2 mb-1">
                <span className="block font-semibold">
                    {isUser ? "You" : "Bot"}:
                </span>
                {message.timestamp && (
                    <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                    </span>
                )}
            </div>
            <div className="break-words">
                {message.content}
            </div>
        </div>
    );
} 