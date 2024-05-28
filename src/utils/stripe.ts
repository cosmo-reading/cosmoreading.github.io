import type { Stripe } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';

/**
 * Custom.
 *
 * Default stripe config.
 */
export const STRIPE_CONFIG = {
    currency: 'usd',
} as const;

/**
 * Custom.
 *
 * Will contain stripe object if it has been loaded.
 */
let stripePromise: Promise<Stripe | null>;

/**
 * Custom function.
 *
 * Loads stripe object using stripe key in env file.
 */
export const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe(process.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY!);
    }

    return stripePromise;
};

/**
 * Custom function.
 *
 * Formats given amount for display with currency symbol.
 * Also handles the decimal currencies.
 */
export function formatAmountForStripe(amount: number, currency: string): number {
    const numberFormat = new Intl.NumberFormat(['en-US'], {
        style: 'currency',
        currency: currency,
        currencyDisplay: 'symbol',
    });

    const parts = numberFormat.formatToParts(amount);

    let zeroDecimalCurrency = true;

    for (const part of parts) {
        if (part.type === 'decimal') {
            zeroDecimalCurrency = false;
        }
    }
    return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}
