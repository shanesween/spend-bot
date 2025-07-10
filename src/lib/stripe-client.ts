import { loadStripe, Stripe } from '@stripe/stripe-js';

// Validate environment variable
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!publishableKey) {
    console.error('❌ Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
    console.error('📝 Please add it to your .env.local file:');
    console.error('   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here');
}

if (publishableKey && !publishableKey.startsWith('pk_')) {
    console.error('❌ Invalid Stripe publishable key format');
    console.error('📝 Publishable key should start with pk_test_ or pk_live_');
}

// Initialize Stripe with your publishable key
// Only initialize if we have a valid key
const stripePromise = publishableKey && publishableKey.startsWith('pk_')
    ? loadStripe(publishableKey)
    : null;

/**
 * Get the Stripe instance
 * @returns Promise<Stripe | null>
 */
export const getStripe = async (): Promise<Stripe | null> => {
    if (!stripePromise) {
        console.error('❌ Stripe not initialized. Check your environment variables.');
        return null;
    }
    return await stripePromise;
};

/**
 * Check if Stripe is properly configured
 * @returns boolean
 */
export const isStripeConfigured = (): boolean => {
    return !!(publishableKey && publishableKey.startsWith('pk_'));
};

/**
 * Stripe appearance configuration for consistent styling
 */
export const stripeAppearance = {
    theme: 'stripe' as const,
    variables: {
        colorPrimary: '#0570de',
        colorBackground: '#ffffff',
        colorText: '#30313d',
        colorDanger: '#df1b41',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '6px',
    },
    rules: {
        '.Input': {
            border: '1px solid #e5e7eb',
            padding: '12px',
            fontSize: '14px',
        },
        '.Input:focus': {
            border: '1px solid #0570de',
            boxShadow: '0 0 0 3px rgba(5, 112, 222, 0.1)',
        },
        '.Label': {
            fontSize: '14px',
            fontWeight: '500',
            marginBottom: '6px',
        },
    },
};

/**
 * Stripe Elements options
 */
export const elementsOptions = {
    appearance: stripeAppearance,
    loader: 'auto' as const,
};

/**
 * Card Element options
 */
export const cardElementOptions = {
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
}; 