import { GoogleAnalyticsPlugin } from '@app/analytics/ga';
import { isBrowser } from '@app/utils/utils';
import { useMemo } from 'react';

import { AmplitudePlugin } from './amplitude';
import { GTMPlugin } from './gtm';
import type { AnalyticsPayment, AnalyticsPluginDeclaration, AnalyticsPluginInstance, AnalyticsUserInfo } from './types';

function makePlugin<N extends string, C, O>(
    plugin: AnalyticsPluginDeclaration<N, C, O>
): AnalyticsPluginDeclaration<N, C, O> {
    return plugin;
}

const Plugins = {
    amplitude: makePlugin({
        name: 'amplitude',
        plugin: new AmplitudePlugin(),
        enabled: !!import.meta.env?.VITE_REACT_APP_AMPLITUDE_API_KEY,
        options: {
            apiKey: import.meta.env?.VITE_REACT_APP_AMPLITUDE_API_KEY,
            serverUrl: import.meta.env?.VITE_REACT_APP_AMPLITUDE_API_END_POINT,
            appVersion: import.meta.env?.VITE_REACT_APP_VERSION || 'Unknown',
            transport: 'beacon' as import('@amplitude/analytics-browser').Types.TransportType,
        },
    }),
    gtm: makePlugin({
        name: 'gtm',
        plugin: new GTMPlugin(),
        enabled: !!import.meta.env?.VITE_REACT_APP_GTM_ID,
        options: {
            tagId: import.meta.env?.VITE_REACT_APP_GTM_ID,
        },
    }),
    ga: makePlugin({
        name: 'ga',
        plugin: new GoogleAnalyticsPlugin(),
        enabled: !!import.meta.env?.VITE_REACT_APP_GA_ID,
        options: {
            id: import.meta.env?.VITE_REACT_APP_GA_ID,
        },
    }),
};

type PluginNames = keyof typeof Plugins;

type DoAnalyticsActionOptions = {
    excludePlugins: PluginNames[];
};

const analytics = {
    enabled: isBrowser(), //process.env.PROD,
    plugins: Plugins,
    getPlugin<N extends PluginNames>(name: N) {
        return analytics.plugins[name];
    },
};

export const getAnalytics = () => analytics;

export const doAnalyticsAction = (
    action: (instance: AnalyticsPluginInstance<any, any>) => void,
    options?: DoAnalyticsActionOptions
) => {
    if (!analytics.enabled) {
        return;
    }

    const plugins = Object.values(analytics.plugins);
    const excludePlugins = new Set(options?.excludePlugins || []);

    for (const { plugin } of plugins.filter(f => f.enabled && !excludePlugins.has(f.name))) {
        action(plugin);
    }
};

export const initAnalytics = () => {
    if (!analytics.enabled) {
        return false;
    }

    const plugins = Object.values(analytics.plugins);

    for (const decl of plugins.filter(f => f.enabled)) {
        decl.plugin.onReady(instance => decl.onReady?.(instance));
        decl.plugin.init(decl.options);
    }
    return true;
};

export const enableAnalyticsPlugin = (name: PluginNames) => {
    const dec = analytics.getPlugin(name);

    dec.enabled = true;
    dec.plugin.onReady(instance => dec.onReady?.(instance));
    dec.plugin.init(dec.options);
};

export const disableAnalyticsPlugin = (name: PluginNames) => {
    const dec = analytics.getPlugin(name);

    dec.enabled = false;
};

export const setAnalyticsUser = async (userId: string | null, info: AnalyticsUserInfo | null) => {
    doAnalyticsAction(a => a.setUser?.(userId, info));
};

export const normalizeProperties = properties => {
    if (!properties) {
        return properties;
    }
    const newProps = { ...properties };
    if (properties['Completion Status'] !== undefined) {
        switch (properties['Completion Status']) {
            case 0:
                newProps['Completion Status'] = 'Completed';
                break;
            case 1:
                newProps['Completion Status'] = 'Ongoing';
                break;
            case 2:
                newProps['Completion Status'] = 'Hiatus';
                break;
        }
    }

    return newProps;
};

export const logAnalyticsEvent = (
    eventName: string,
    properties?: Record<string, string | string[] | number | number[] | null | undefined>,
    options?: DoAnalyticsActionOptions // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
    // normalizeProperties
    const normalizedProperties = normalizeProperties(properties);

    // console.info('logAnalyticsEvent', eventName, normalizedProperties, options);
    // doAnalyticsAction(a => a.trackEvent(eventName, properties), options);
    // Exclude GTM until GTM tags ready
    doAnalyticsAction(a => a.trackEvent(eventName, normalizedProperties), { excludePlugins: ['gtm', 'ga'] });
};

export const logEvent = (
    eventName: string,
    properties?: Record<string, string | string[] | number | number[] | null>
) => {
    doAnalyticsAction(a => a.trackEvent(eventName, properties));
};

export const logGtmEvent = (
    eventName: string,
    properties?: Record<string, string | string[] | number | number[] | null>
) => {
    doAnalyticsAction(a => a.trackEvent(eventName, properties), { excludePlugins: ['amplitude', 'ga'] });
};

export const logGAEvent = (
    eventName: string,
    properties?: Record<string, string | string[] | number | number[] | null>
) => {
    const plugin = analytics.getPlugin('ga').plugin as GoogleAnalyticsPlugin;

    plugin.execCommand('event', eventName, properties);
};

export const logAnalyticsPayment = (payment: AnalyticsPayment) => doAnalyticsAction(a => a.trackPayment(payment));

export const useAnalytics = () => {
    return useMemo(
        () => ({
            logEvent: logAnalyticsEvent,
            logPayment: logAnalyticsPayment,
            enablePlugin: enableAnalyticsPlugin,
            disablePlugin: disableAnalyticsPlugin,
            doAction: doAnalyticsAction,
        }),
        []
    );
};
