import { InvoiceSummary, InteractiveAction } from "@/types/chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InvoiceSelectionCardProps {
    invoices: InvoiceSummary[];
    onAction: (action: InteractiveAction) => void;
}

export function InvoiceSelectionCard({ invoices, onAction }: InvoiceSelectionCardProps) {
    const formatCurrency = (amount: number, currency: string) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency
        }).format(amount / 100);

    const formatDate = (timestamp?: number | null) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "paid":
                return "text-green-600";
            case "open":
                return "text-orange-600";
            case "draft":
                return "text-gray-600";
            case "void":
                return "text-red-600";
            default:
                return "text-gray-600";
        }
    };

    const handleSelectInvoice = (invoiceId: string) => {
        onAction({
            type: 'select_invoice',
            data: { invoiceId }
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
                <CardTitle className="text-lg">💳 Select Invoice to Pay</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {invoices.map((invoice) => (
                    <div
                        key={invoice.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                                <div className="font-medium text-gray-900">
                                    {invoice.account_name || "Unknown Account"}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {invoice.description}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="font-bold text-lg">
                                    {formatCurrency(invoice.total, invoice.currency)}
                                </div>
                                <div className={`text-sm font-medium ${getStatusColor(invoice.status)}`}>
                                    {invoice.status}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                            <span>Due: {formatDate(invoice.due_date)}</span>
                            <span className="font-mono">#{invoice.number}</span>
                        </div>

                        <Button
                            onClick={() => handleSelectInvoice(invoice.id)}
                            className="w-full"
                            variant="default"
                        >
                            Select This Invoice
                        </Button>
                    </div>
                ))}

                <div className="pt-2 border-t">
                    <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="w-full"
                    >
                        Cancel
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
} 