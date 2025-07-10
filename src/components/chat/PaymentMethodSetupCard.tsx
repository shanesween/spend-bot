import { useState, useEffect } from "react";
import { InteractiveAction } from "@/types/chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, AlertCircle, CheckCircle } from "lucide-react";
import { getStripe, elementsOptions, isStripeConfigured } from "@/lib/stripe-client";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Stripe, StripeCardElementChangeEvent } from "@stripe/stripe-js";

interface PaymentMethodSetupCardProps {
    setupIntentClientSecret: string;
    onAction: (action: InteractiveAction) => void;
}

function PaymentMethodForm({ setupIntentClientSecret, onAction }: PaymentMethodSetupCardProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isComplete, setIsComplete] = useState(false);
    const [cardError, setCardError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            setError('Stripe has not loaded yet. Please try again.');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Card element not found. Please refresh and try again.');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Confirm the SetupIntent with the card element
            const { error: confirmError, setupIntent } = await stripe.confirmCardSetup(
                setupIntentClientSecret,
                {
                    payment_method: {
                        card: cardElement,
                    },
                }
            );

            if (confirmError) {
                setError(confirmError.message || 'An error occurred while setting up your payment method.');
            } else if (setupIntent && setupIntent.payment_method) {
                // Success! Payment method has been set up
                onAction({
                    type: 'setup_payment_method',
                    data: {
                        setupIntentClientSecret,
                        paymentMethodId: setupIntent.payment_method.toString()
                    }
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardChange = (event: StripeCardElementChangeEvent) => {
        if (event.error) {
            setCardError(event.error.message);
        } else {
            setCardError(null);
        }
        setIsComplete(event.complete);
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
                    <Plus className="h-5 w-5" />
                    Add Payment Method
                </CardTitle>
                <p className="text-sm text-gray-600">
                    Add a payment method to pay your invoices. This will be set as your default payment method.
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Security Info */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <CreditCard className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                            <h4 className="font-medium text-blue-900">Secure Payment Setup</h4>
                            <p className="text-sm text-blue-700 mt-1">
                                Your payment information is securely processed by Stripe.
                                We don&apos;t store your card details on our servers.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Test Card Info */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-green-800">Test Mode</h4>
                            <p className="text-sm text-green-700 mt-1">
                                Use test card: <code className="bg-green-100 px-2 py-1 rounded text-green-800">4242 4242 4242 4242</code>
                            </p>
                            <p className="text-xs text-green-600 mt-1">
                                Any future expiry date and any 3-digit CVC
                            </p>
                        </div>
                    </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Card Information
                        </label>
                        <div className="border rounded-lg p-3 bg-white">
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: '#424770',
                                            '::placeholder': {
                                                color: '#aab7c4',
                                            },
                                        },
                                        invalid: {
                                            color: '#9e2146',
                                        },
                                    },
                                    hidePostalCode: false,
                                }}
                                onChange={handleCardChange}
                            />
                        </div>
                        {cardError && (
                            <p className="text-sm text-red-600 mt-1">{cardError}</p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                            <div className="flex items-start gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                                <div>
                                    <strong>Error:</strong> {error}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="submit"
                            disabled={isLoading || !isComplete || !stripe}
                            className="flex-1"
                        >
                            {isLoading ? "Setting up..." : "Add Payment Method"}
                        </Button>
                        <Button
                            type="button"
                            onClick={handleCancel}
                            variant="outline"
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function StripeConfigurationError({ onAction }: { onAction: (action: InteractiveAction) => void }) {
    const handleCancel = () => {
        onAction({ type: 'cancel_flow' });
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Stripe Configuration Required
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="space-y-3">
                        <p className="text-sm text-red-700">
                            <strong>Missing Stripe Configuration</strong>
                        </p>
                        <p className="text-sm text-red-600">
                            To use payment features, you need to set up your Stripe API keys.
                        </p>
                        <div className="bg-red-100 rounded p-3 mt-2">
                            <p className="text-xs text-red-800 font-mono">
                                Create a <code>.env.local</code> file with:
                            </p>
                            <pre className="text-xs text-red-700 mt-2">
                                {`NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_CUSTOMER_ID=cus_...`}
                            </pre>
                        </div>
                        <p className="text-xs text-red-600">
                            Get these keys from your{' '}
                            <a
                                href="https://dashboard.stripe.com/apikeys"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline hover:text-red-800"
                            >
                                Stripe Dashboard
                            </a>
                        </p>
                    </div>
                </div>

                <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full"
                >
                    Close
                </Button>
            </CardContent>
        </Card>
    );
}

export function PaymentMethodSetupCard({ setupIntentClientSecret, onAction }: PaymentMethodSetupCardProps) {
    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);

    useEffect(() => {
        // Check if Stripe is properly configured
        if (!isStripeConfigured()) {
            console.error('❌ Stripe not configured properly');
            return;
        }

        setStripePromise(getStripe());
    }, []);

    // Show configuration error if Stripe is not set up
    if (!isStripeConfigured()) {
        return <StripeConfigurationError onAction={onAction} />;
    }

    // Show loading while Stripe initializes
    if (!stripePromise) {
        return (
            <Card className="w-full">
                <CardContent className="py-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-sm text-gray-600">Loading Stripe...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Elements stripe={stripePromise} options={{
            ...elementsOptions,
            clientSecret: setupIntentClientSecret
        }}>
            <PaymentMethodForm
                setupIntentClientSecret={setupIntentClientSecret}
                onAction={onAction}
            />
        </Elements>
    );
} 