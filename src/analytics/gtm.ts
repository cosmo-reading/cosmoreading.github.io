import type { AnalyticsPayment, AnalyticsPluginInstance } from './types';

declare global {
    interface Window {
        dataLayer: any[];
    }
}

type GTMPluginConfig = {
    tagId?: string;
};

export type GTMPluginType = AnalyticsPluginInstance<Window['dataLayer'], GTMPluginConfig>;

export class GTMPlugin implements AnalyticsPluginInstance<Window['dataLayer'], GTMPluginConfig> {
    init({ tagId }: GTMPluginConfig) {
        if (typeof tagId === 'undefined') {
            throw new Error('Missing GTM tag id');
        }

        window.dataLayer = window.dataLayer || [];

        ((w: any, d: any, s: any, l: any, i: any) => {
            w[l] = w[l] || [];
            w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
            var f = d.getElementsByTagName(s)[0],
                j = d.createElement(s),
                dl = l != 'dataLayer' ? '&l=' + l : '';
            j.async = true;
            j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
            f.parentNode.insertBefore(j, f);
        })(window, document, 'script', 'dataLayer', tagId);
    }

    onReady(action: (instance: object[]) => void): void {} // eslint-disable-line @typescript-eslint/no-unused-vars

    getInstance(): object[] {
        return window.dataLayer;
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
}
