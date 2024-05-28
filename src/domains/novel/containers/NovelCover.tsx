import type { BookmarkItem } from '@app/_proto/Protos/bookmarks';
import type { NovelItem } from '@app/_proto/Protos/novels';
import { KarmaPricingModel } from '@app/_proto/Protos/pricing';
import { analyticsFactory } from '@app/analytics/handlers';
import ReviewsDialog, { type DialogRef } from '@app/components/reviews/reviews.dialog';
import { StyledAppDefaultMarginsClasses } from '@app/components/shared/app-main-container.styles';
import { HeroHighlightContainer } from '@app/components/shared/generic.styles';
import useChampionSubscriptions from '@app/domains/champion/hooks/useChampionSubscriptions';
import TruncateDisclosure from '@app/domains/common/components/TruncateDisclosure';
import TruncateShowOrHide from '@app/domains/common/components/TruncateShowOrHide';
import { useMediaQuery } from '@app/domains/common/hooks/useMediaQuery';
import useNovelStatus from '@app/domains/common/hooks/useNovelStatus';
import usePricingModelStatus from '@app/domains/common/hooks/usePricingModelStatus';
import { NovelEvents } from '@app/domains/novel/analytics/amplitude/events';
import HeroTextPlaceholder from '@app/domains/novel/components/HeroTextPlaceholder';
import NovelActions from '@app/domains/novel/components/NovelActions';
import NovelCoverInfo from '@app/domains/novel/components/NovelCoverInfo';
import NovelCoverReviewScore from '@app/domains/novel/components/NovelCoverReviewScore';
import NovelCoverTitle from '@app/domains/novel/components/NovelCoverTitle';
import NovelCoverWtuStatusBar from '@app/domains/novel/components/NovelCoverWtuStatusBar';
import NovelResponsiveCoverImage from '@app/domains/novel/components/NovelResponsiveCoverImage';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import useNovelVipBenefit from '@app/domains/novel/hooks/useNovelVipBenefit';
import { decimalToNumber, durationToNumber, timestampToDate } from '@app/libs/utils';
import { breakpoints } from '@app/utils/breakpoints';
import { paragraphTransform, useHtmlToReact } from '@app/utils/html';
import { Grid } from '@mui/material';
import clsx from 'clsx';
import { useCallback, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    novel: NovelItem | null;
    bookmark?: BookmarkItem;
    novelSlug?: string;
    isNovelDetailLoading?: boolean;
};

export default function NovelCover({ novel, bookmark, novelSlug, isNovelDetailLoading = false }: Props) {
    const { info, wtuInfo, userWtuInfo, wtuStatus } = usePricingModelStatus({
        novel,
    });

    const reviewDialogRef = useRef<DialogRef>(null);

    const { isVipBenefit, isLoading: isVipBenefitLoading } = useNovelVipBenefit(novel ?? undefined);

    const { activeSubscription, isLoading: isChampionLoading } = useChampionSubscriptions({
        novelId: novel?.id,
        keepPreviousData: false,
    });
    const championedNovel = !!activeSubscription;

    const { activePricingModelType: pricingModel } = useNovelStatus({
        novel: novel ?? undefined,
    });

    const { timeLeft: waitCompleteTimeStamp, unlocksLeft: remainingCoupons } = userWtuInfo || {};
    const { unlocksPerWaitTime: maxCoupons, waitTime } = wtuInfo || {};

    const waitCompleteDate = timestampToDate(waitCompleteTimeStamp) || undefined;
    const karmaFreeChapters = (KarmaPricingModel.is(info) && decimalToNumber(info.freeChapters)) || undefined;
    const waitTimeSec = waitTime !== undefined ? durationToNumber(waitTime) : undefined;
    const reviewRating = novel?.reviewInfo?.rating?.value;
    const reviewCount = novel?.reviewInfo?.count;

    const author = novel?.authorName?.value;
    const translator = novel?.translatorName?.value || novel?.translator?.userName;
    const firstChapter = novel?.chapterInfo?.firstChapter;

    const synopsis = useHtmlToReact(novel?.synopsis?.value || '', {
        transform: {
            p: paragraphTransform,
        },
        removeTags: ['hr', 'img'],
    });

    const handleChapterRead = useCallback(() => {
        if (novel) {
            const targetChapter = bookmark?.chapter || novel.chapterInfo?.firstChapter;
            const event = bookmark?.chapter ? NovelEvents.ClickContinueReading : NovelEvents.ClickStartReading;
            analyticsFactory(event)({ novel, chapter: targetChapter });
        }
    }, [bookmark?.chapter, novel]);

    const isDesktop = useMediaQuery(breakpoints.upSm2);

    return (
        <div
            css={HeroHighlightContainer}
            className="bg-gray-100 bg-[url('/images/Noise@3x.jpg')] bg-[length:160px] dark:bg-gray-900 dark:bg-[url('/images/Noise-dark@3x.jpg')]"
        >
            <div
                className={twMerge(
                    StyledAppDefaultMarginsClasses,
                    'w-full px-[24px] pb-0 text-gray-t1 sm2:px-[40px] md:max-w-[1024px] lg:px-[40px]'
                )}
            >
                <Grid container className="pb-[33px] pt-[16px] sm2:flex-nowrap sm2:space-x-[30px] sm2:py-[60px]">
                    <Grid className="max-w-full sm2:flex-1" item container>
                        <div className="mx-auto sm2:mx-0">
                            <div className={clsx('h-204 w-140 sm2:h-350 sm2:w-240', 'relative')}>
                                <NovelResponsiveCoverImage
                                    novel={novel ?? undefined}
                                    imgUrl={novel?.coverUrl?.value}
                                    imgBlurHash={novel?.coverBlurHash?.value}
                                    isLoading={!novel}
                                    srcWidth={isDesktop ? 240 : 140}
                                    srcHeight={isDesktop ? 350 : 204}
                                    classes={{
                                        img: 'drop-shadow-ww-novel-cover-image rounded-r-6',
                                    }}
                                />
                            </div>
                        </div>
                    </Grid>
                    <Grid className="pt-[8px] sm2:pt-0" item container direction="column" alignItems="flex-start">
                        <NovelCoverTitle novelStatus={novel?.status} isLoading={!novel} title={novel?.name} />
                        <div className="mt-[4px] sm2:mt-[8px]">
                            <NovelCoverReviewScore
                                isLoading={!novel}
                                reviewRating={reviewRating}
                                reviewCount={reviewCount}
                                onReviewClick={() => {
                                    reviewDialogRef.current?.open();

                                    analyticsFactory(NovelEvents.ClickSeriesReviews)({
                                        novel,
                                        on: 'Series Cover',
                                    });
                                }}
                            />
                            <ReviewsDialog ref={reviewDialogRef} entity={novel} />
                        </div>
                        <div className="mt-[8px]">
                            <NovelCoverInfo author={author} translator={translator} isLoading={!novel} />
                        </div>
                        <div className="flex flex-col sm2:mt-[2px]">
                            <HeroTextPlaceholder
                                item={novel}
                                count={2}
                                className="mb-[6px] h-[16px] w-[315px] max-w-full last:mb-0 sm2:mb-[10px] sm2:w-[500px] sm2:last:w-[243px]"
                                skeletonProps={BASE_SKELETON_PROPS}
                            >
                                <TruncateDisclosure>
                                    <TruncateDisclosure.Content
                                        lines={2}
                                        className="font-set-r13 gap-y-[18px] text-gray-desc sm2:font-set-r15"
                                    >
                                        {synopsis}
                                    </TruncateDisclosure.Content>
                                    <TruncateDisclosure.Toggle
                                        showingComponent={<TruncateShowOrHide showing={true} />}
                                        hidingComponent={<TruncateShowOrHide showing={false} />}
                                    />
                                </TruncateDisclosure>
                            </HeroTextPlaceholder>
                        </div>
                        <Grid container item className="mt-auto sm2:w-[335px]">
                            {wtuStatus && (
                                <div className="mt-[16px] w-full sm2:mt-[12px]">
                                    <NovelCoverWtuStatusBar
                                        isLoading={isNovelDetailLoading || isVipBenefitLoading || isChampionLoading}
                                        wtuStatus={wtuStatus}
                                        waitTimeSec={waitTimeSec}
                                        waitCompleteDate={waitCompleteDate}
                                        remainingCoupons={remainingCoupons}
                                        maxCoupons={maxCoupons}
                                        vipBenefitedNovel={isVipBenefit}
                                        championedNovel={championedNovel}
                                    />
                                </div>
                            )}
                            <div className="mt-[16px] w-full sm2:mt-[12px]">
                                <NovelActions
                                    novelId={novel?.id}
                                    novelSlug={novelSlug}
                                    bookmarkChapter={bookmark?.chapter}
                                    isLoading={isNovelDetailLoading || isVipBenefitLoading}
                                    pricingModel={pricingModel}
                                    firstChapter={firstChapter}
                                    karmaFreeChapters={karmaFreeChapters}
                                    onChapterRead={handleChapterRead}
                                    vipBenefitedNovel={isVipBenefit}
                                />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </div>
    );
}
