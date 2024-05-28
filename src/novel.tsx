import type { NovelItem } from '@app/_proto/Protos/novels';
import { IsVipBenefitContext } from '@app/components/chapters/hooks';
import Layout, { type LayoutProps } from '@app/components/layout';
import { LoadingFallback } from '@app/components/loading';
import useNovel from '@app/domains/novel/hooks/useNovel';
import useNovelVipBenefit from '@app/domains/novel/hooks/useNovelVipBenefit';
import usePageVisitLog from '@app/hooks/usePageVisitLog';
import { useAuth } from '@app/libs/auth';
import { Suspense, startTransition, useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export type NovelPageProps = {
    Component: React.ComponentType<{ novel?: NovelItem }>;
    onNovelLoad?: (novel: NovelItem) => void;
    logEventName?: string;
} & LayoutProps;

function NovelPageComponent({ Component, onNovelLoad, logEventName = '' }: NovelPageProps) {
    const navigate = useNavigate();
    usePageVisitLog({ logEventName });
    //#region : Get novel data

    const { novelSlug } = useParams();
    const { user } = useAuth();

    const { data: novel } = useNovel({
        novelSlug: novelSlug ?? '',
        userId: user?.id,
        noItemHandler: () => {
            navigate(`/404`, { replace: true });
        },
    });
    const { isLoading: isVipBenefitLoading, isVipBenefit } = useNovelVipBenefit(novel);

    useEffect(() => {
        if (novel) {
            onNovelLoad?.(novel);
        }
    }, [novel, onNovelLoad]);

    if (!novel) {
        return null;
    }

    return (
        <IsVipBenefitContext.Provider value={!isVipBenefitLoading ? isVipBenefit : undefined}>
            <Component novel={novel} />
        </IsVipBenefitContext.Provider>
    );
}

export default function NovelPage({ Component, logEventName, ...rest }: NovelPageProps) {
    const [novel, setNovel] = useState<NovelItem>();

    const handleNovelData = useCallback((novel: NovelItem) => {
        startTransition(() => setNovel(novel));
    }, []);

    return (
        <Layout defaultMargins={false} novel={novel} {...rest}>
            <Suspense fallback={<LoadingFallback displayType="indicator" />}>
                <div id="loading-container-replacement">
                    <NovelPageComponent
                        onNovelLoad={handleNovelData}
                        Component={Component}
                        logEventName={logEventName}
                    />
                </div>
            </Suspense>
        </Layout>
    );
}

NovelPage.defaultProps = {
    showFooter: true,
    showNavItems: true,
};
