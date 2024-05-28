import type { NovelItem } from '@app/_proto/Protos/novels';
import Loading from '@app/components/loading';
import { StyledContentSection, StyledContentSectionTitle } from '@app/components/shared/text-pages.styles';
import { CONTENT_SECTION_TITLE_STYLE } from '@app/domains/common/styles';
import { useAuth } from '@app/libs/auth';
import { Grid, Typography } from '@mui/material';
import { lazy } from 'react';
import { useInView } from 'react-intersection-observer';

const SponsorPlansComponent = lazy(() => import('@app/components/sponsors'));

export default function PopularSubscriptionPlans({
    novel,
    goToTab,
}: {
    novel?: NovelItem;
    goToTab: (tab: string) => void;
}) {
    const [ref, inView] = useInView({
        triggerOnce: true,
    });

    const { user } = useAuth();

    return (
        <>
            <div ref={ref}></div>
            <Loading>
                <StyledContentSection className="mx-auto !mt-[12px] px-0 !pb-0">
                    <Grid container direction="row" justifyContent="space-between" alignItems="center">
                        <Grid item>
                            <StyledContentSectionTitle className="my-[14px] sm:my-[20px]">
                                <span className={CONTENT_SECTION_TITLE_STYLE}>Popular Subscription Tiers</span>
                            </StyledContentSectionTitle>
                        </Grid>
                    </Grid>
                    <Grid container direction="column" className="mb-[30px]">
                        <Grid item>
                            {inView && (
                                <Loading>
                                    <SponsorPlansComponent novel={novel} isMain={false} listType="popular" />
                                </Loading>
                            )}
                        </Grid>
                        {user && (
                            <Grid item>
                                <div className="mt-[30px] flex items-center justify-center">
                                    <Typography
                                        className="cursor-pointer text-[15px] font-bold text-blue hover:underline"
                                        onClick={() => goToTab('champion')}
                                    >
                                        See all Tiers
                                    </Typography>
                                </div>
                            </Grid>
                        )}
                    </Grid>
                </StyledContentSection>
            </Loading>
        </>
    );
}
