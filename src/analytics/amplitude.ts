import type { AnalyticsPayment, AnalyticsPluginInstance, AnalyticsUserInfo } from './types';

type AmplitudeClient = import('@amplitude/analytics-browser').Types.BrowserClient & {
    Revenue: typeof import('@amplitude/analytics-core').Revenue;
    Identify: typeof import('@amplitude/analytics-core').Identify;
};

type AmpltiudePluginConfig = import('@amplitude/analytics-browser').Types.BrowserOptions & {
    apiKey?: string;
};

export type AmplitudePluginType = AnalyticsPluginInstance<AmplitudeClient, AmpltiudePluginConfig>;

type ReadyHandler = (instance: AmplitudeClient) => void;

export class AmplitudePlugin implements AnalyticsPluginInstance<AmplitudeClient, AmpltiudePluginConfig> {
    private _readyHandlers: ReadyHandler[] = [];
    private instance: Promise<AmplitudeClient>;

    init({ apiKey, ...config }: AmpltiudePluginConfig) {
        if (typeof apiKey === 'undefined') {
            throw new Error('Missing Ampltiude API key');
        }

        this.instance = new Promise((resolve, reject) => {
            (async () => {
                try {
                    const amplitude = !process.env.SSR ? await import('@amplitude/analytics-browser') : null;

                    if (!amplitude) {
                        reject('ssr');

                        return;
                    }

                    const instance = amplitude.init(apiKey, undefined, config);
                    instance.promise.then(() => this.readyHandler());

                    resolve(amplitude);
                } catch (e) {
                    reject(e);
                }
            })();
        });
    }

    onReady(action: (instance: AmplitudeClient) => void): void {
        this._readyHandlers.push(action);
    }

    getInstance(): Promise<AmplitudeClient> {
        return this.instance;
    }

    async setUser(userId: string, info: AnalyticsUserInfo | null) {
        const instance = await this.getInstance();
        const identify = new instance.Identify();

        instance.setUserId(userId || undefined);

        if (userId) {
            for (const [key, value] of Object.entries(info || {})) {
                if (value instanceof Date) {
                    identify.set(key, value.toISOString());
                } else {
                    identify.set(key, value);
                }
            }
        } else {
            identify.clearAll();
        }

        instance.identify(identify);
    }

    async trackEvent(eventName: string, properties?: Record<string, any>) {
        (await this.getInstance()).logEvent(eventName, properties);
    }

    async trackPayment({ productId, price, quantity, properties }: AnalyticsPayment) {
        const amplitude = await this.getInstance();

        const revenue = new amplitude.Revenue().setProductId(productId.toString()).setPrice(price);

        if (typeof quantity !== 'undefined') {
            revenue.setQuantity(quantity);
        }

        if (typeof properties !== 'undefined') {
            revenue.setEventProperties(properties);
        }

        amplitude.revenue(revenue);
    }

    private readyHandler = async () => {
        const instance = await this.getInstance();

        for (const handler of this._readyHandlers) {
            handler(instance);
        }
    };
}
