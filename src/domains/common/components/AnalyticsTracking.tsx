import { getAnalytics } from '@app/analytics';
import type { GoogleAnalyticsPlugin } from '@app/analytics/ga';
import { useCompareMemo } from '@app/libs/hooks';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export type AnalyticsTrackingProps = {
    title?: string;
    disabled?: boolean;
    locationTracking?: boolean;
    extraProperties?: Record<string, any>;
};

export function AnalyticsTracking({ title, disabled, locationTracking, extraProperties }: AnalyticsTrackingProps) {
    const { pathname } = useLocation();
    const lastPath = useRef<string | undefined>();

    const extraProps = useCompareMemo(() => extraProperties ?? {}, [extraProperties]);

    const location = locationTracking === false ? undefined : pathname;

    useEffect(() => {
        const isBrowser = typeof window !== 'undefined';
        if (!isBrowser || disabled || lastPath.current === location) {
            return;
        }

        lastPath.current = location;

        const analytics = getAnalytics();
        const { plugin } = analytics.getPlugin('ga');

        if (plugin) {
            const ga = plugin as GoogleAnalyticsPlugin;

            ga.execCommand('event', 'page_view', {
                page_title: title ?? document.title,
                page_location: window.location.href,
                ...extraProps,
            });
        }
    }, [disabled, extraProps, location, title]);

    return null;
}
