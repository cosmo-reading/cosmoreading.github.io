import type { NovelItem } from '@app/_proto/Protos/novels';
import NovelAnnouncementsList from '@app/components/novel-announcements/announcements.list';
import Reviews from '@app/components/reviews/reviews';
import ReviewPlaceholder from '@app/components/reviews/reviews.placeholder';
import NovelAboutDetail from '@app/domains/novel/components/NovelAboutDetail';
import NovelAboutInfo from '@app/domains/novel/components/NovelAboutInfo';
import NovelAboutReviewsWrapper from '@app/domains/novel/components/NovelAboutReviewsWrapper';
import NovelAnnouncementsWrapper from '@app/domains/novel/components/NovelAnnouncementsWrapper';
import PopularSubscriptionPlans from '@app/domains/novel/components/PopularSubscriptionPlans';
import { Suspense } from 'react';

export default function NovelBodyAboutTab({ novel, goToTab }: { novel: NovelItem; goToTab: (tab: string) => void }) {
    const descriptionHtml = novel.description?.value || '';

    return (
        <div className="pb-[10px]">
            <div className="border-ww-divider-bottom py-[20px] sm2:py-[28px]">
                <NovelAboutInfo novel={novel} />
            </div>
            {descriptionHtml && (
                <div className="border-ww-divider-bottom py-[20px] sm2:py-[28px]">
                    <NovelAboutDetail descriptionHtml={descriptionHtml} />
                </div>
            )}
            <div className="pb-16">
                <Suspense
                    fallback={
                        <NovelAboutReviewsWrapper>
                            <ReviewPlaceholder />
                            <ReviewPlaceholder />
                        </NovelAboutReviewsWrapper>
                    }
                >
                    <Reviews
                        entity={novel}
                        title={false}
                        pagination={false}
                        sorting={false}
                        submitReview
                        reviewCount={3}
                        wrapperComponent={NovelAboutReviewsWrapper}
                        showsDialogOpener
                    />
                </Suspense>
            </div>
            <NovelAnnouncementsList
                novel={novel}
                announcementsCount={2}
                hideWhenNoAnnouncements
                wrapperComponent={NovelAnnouncementsWrapper}
            />

            {(!novel || (!!novel && novel.sponsorInfo?.hasAnyPlans?.value)) && (
                <PopularSubscriptionPlans novel={novel} goToTab={goToTab} />
            )}
        </div>
    );
}
