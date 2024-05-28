import Layout, { type LayoutProps } from '@app/components/layout';
import { LoadingFallback } from '@app/components/loading';
import { AnalyticsTracking } from '@app/domains/common/components/AnalyticsTracking';
import usePageVisitLog from '@app/hooks/usePageVisitLog';
import { type ComponentType, Suspense } from 'react';

export default function PageComponent({
    Component,
    logEventName = '',
    ...layoutProps
}: {
    Component: ComponentType;
    logEventName?: string;
} & LayoutProps) {
    usePageVisitLog({ logEventName });

    return (
        <Layout {...layoutProps}>
            <Suspense fallback={<LoadingFallback displayType="indicator" />}>
                <div id="loading-container-replacement">
                    <Component />
                </div>
                <AnalyticsTracking />
            </Suspense>
        </Layout>
    );
}

PageComponent.defaultProps = {
    showFooter: true,
    showNavItems: true,
    defaultMargins: true,
};
