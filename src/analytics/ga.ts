import type { AnalyticsPayment, AnalyticsPluginInstance, AnalyticsUserInfo } from './types';

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

type GoogleAnalyticsPluginConfig = {
    id?: string;
};

export type GoogleAnalyticsPluginType = AnalyticsPluginInstance<Window['dataLayer'], GoogleAnalyticsPluginConfig>;

export class GoogleAnalyticsPlugin
    implements AnalyticsPluginInstance<Window['dataLayer'], GoogleAnalyticsPluginConfig>
{
    init({ id }: GoogleAnalyticsPluginConfig) {
        if (typeof id === 'undefined') {
            throw new Error('Missing GA id');
        }
    }

    onReady(action: (instance: any[]) => void): void {} // eslint-disable-line @typescript-eslint/no-unused-vars

    getInstance(): any[] {
        return window.dataLayer;
    }

    execCommand(...params: any[]): void {
        if (!('gtag' in window)) {
            return;
        }

        window.gtag(...params);
    }

    trackEvent(eventName: string, properties?: Record<string, any>): void {
        const instance = this.getInstance();

        instance.push({
            event: eventName,
            ...properties,
        });
    }

    trackPayment(payment: AnalyticsPayment): void {
        this.trackEvent('Purchase', payment);
    }

    async setUser(userId: string, info: AnalyticsUserInfo | null) {
        const { VIP } = info || {};

        this.execCommand('set', {
            user_id: userId || undefined,
            user_properties: {
                vip: VIP,
            },
        });
    }
}
