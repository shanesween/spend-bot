import { InvoiceSummary } from "@/types/chat";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InvoiceCardProps {
    invoice: InvoiceSummary;
}

export function InvoiceCard({ invoice }: InvoiceCardProps) {
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

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="py-3 space-y-2">
                <div className="text-lg text-gray-900">
                    {invoice.account_name}
                </div>
                <div className="text-md text-gray-900">
                    {invoice.description}
                </div>

                <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium">
                            {formatCurrency(invoice.total, invoice.currency)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`font-medium ${getStatusColor(invoice.status)}`}>
                            {invoice.status}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Due:</span>
                        <span className="font-medium">
                            {formatDate(invoice.due_date)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-600">Invoice #:</span>
                        <span className="font-mono text-sm">
                            {invoice.number}
                        </span>
                    </div>
                </div>

                <div className="pt-2">
                    <a
                        href={invoice.hosted_invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block"
                    >
                        <Button variant="outline" size="sm" className="w-full">
                            View Invoice
                        </Button>
                    </a>
                </div>
            </CardContent>
        </Card>
    );
} 