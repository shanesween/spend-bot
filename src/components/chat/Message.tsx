import { Message as MessageType } from "@/types/chat";
import { InvoiceCard } from "./InvoiceCard";
import { InvoiceSelectionCard } from "./InvoiceSelectionCard";
import { PaymentConfirmationCard } from "./PaymentConfirmationCard";

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

            {/* Interactive Elements */}
            {message.interactive && (
                <div className="mb-4">
                    {message.interactive.type === 'invoice_selection' &&
                        message.interactive.invoices &&
                        message.interactive.onAction && (
                            <InvoiceSelectionCard
                                invoices={message.interactive.invoices}
                                onAction={message.interactive.onAction}
                            />
                        )}

                    {message.interactive.type === 'payment_confirmation' &&
                        message.interactive.selectedInvoice &&
                        message.interactive.onAction && (
                            <PaymentConfirmationCard
                                invoice={message.interactive.selectedInvoice}
                                onAction={message.interactive.onAction}
                            />
                        )}
                </div>
            )}

            {/* Regular Content */}
            {message.invoices ? (
                <div className="space-y-4">
                    {message.invoices.map((invoice) => (
                        <InvoiceCard key={invoice.id} invoice={invoice} />
                    ))}
                </div>
            ) : message.content ? (
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
            ) : null}
        </div>
    );
}
