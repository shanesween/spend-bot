import { InvoiceSummary, InteractiveAction } from "@/types/chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CreditCard } from "lucide-react";

interface PaymentConfirmationCardProps {
    invoice: InvoiceSummary;
    onAction: (action: InteractiveAction) => void;
}

export function PaymentConfirmationCard({ invoice, onAction }: PaymentConfirmationCardProps) {
    const formatCurrency = (amount: number, currency: string) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency
        }).format(amount / 100);

    const formatDate = (timestamp?: number | null) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const handleConfirmPayment = () => {
        onAction({
            type: 'confirm_payment',
            data: { invoiceId: invoice.id }
        });
    };

    const handleCancel = () => {
        onAction({
            type: 'cancel_flow'
        });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Confirm Payment
                </CardTitle>
                <p className="text-sm text-gray-600">
                    Please review the invoice details and confirm payment:
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Invoice Details */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <div className="font-medium text-gray-900">
                                    {invoice.account_name || "Unknown Account"}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {invoice.description}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-xl text-blue-600">
                                    {formatCurrency(invoice.total, invoice.currency)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-600">Invoice #:</span>
                                <span className="font-mono ml-2">{invoice.number}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Due Date:</span>
                                <span className="ml-2">{formatDate(invoice.due_date)}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Status:</span>
                                <span className="ml-2 capitalize">{invoice.status}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">Currency:</span>
                                <span className="ml-2 uppercase">{invoice.currency}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Warning */}
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm">
                        <p className="font-medium text-yellow-800">Payment Confirmation</p>
                        <p className="text-yellow-700">
                            This will immediately process the payment for the full amount.
                            This action cannot be undone.
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                    <Button
                        onClick={handleConfirmPayment}
                        className="flex-1"
                        variant="default"
                    >
                        Confirm Payment
                    </Button>
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 