import type { AllEvents } from '@app/analytics/handlers';
import useInViewForAmplitude from '@app/domains/common/hooks/useInViewForAmplitude';
import useNovelStatus from '@app/domains/common/hooks/useNovelStatus';
import type { ClassNameType, ContentItem } from '@app/domains/common/types';
import { getNovelPath } from '@app/domains/common/utils/path';
import { HomeEvents } from '@app/domains/home/analytics/amplitude/events';
import rankingStyles from '@app/domains/home/components/ranking.styles.module.scss';
import HeroTextPlaceholder from '@app/domains/novel/components/HeroTextPlaceholder';
import NovelResponsiveCoverImage, { type WtuBadgeType } from '@app/domains/novel/components/NovelResponsiveCoverImage';
import NovelReviewScore from '@app/domains/novel/components/NovelReviewScore';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import { HOME_NOVEL_REVIEW_SCORE_STYLE } from '@app/domains/novel/styles/NovelReviewScore.style';
import { convertNovelStatusToStr } from '@app/domains/novel/utils';
import { breakpoints } from '@app/utils/breakpoints';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { type PropsWithChildren, type ReactNode, createContext, useContext, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSwiperSlide } from 'swiper/react';
import { twMerge } from 'tailwind-merge';

type Props = {
    content: ContentItem | undefined;
    children?: ReactNode;
    isLoading?: boolean;
    viewLogDisabled?: boolean;
    clickEvent?: AllEvents;
};

function HomeContent({ content, children, isLoading, viewLogDisabled, clickEvent }: Props) {
    const { ref } = useInViewForAmplitude({
        event: HomeEvents.ViewCollectionItem,
        triggerOnce: true,
        skip: viewLogDisabled || isLoading,
    });

    const { reviewRating } = useNovelStatus({ novel: content });

    const value = useMemo(
        () => ({ content, reviewRating, isLoading, clickEvent }),
        [content, reviewRating, isLoading, clickEvent]
    );

    return (
        <HomeContentContext.Provider value={value}>
            <section ref={ref}>{children}</section>
        </HomeContentContext.Provider>
    );
}

type ContextProps = {
    content: ContentItem | undefined;
    reviewRating: number | undefined;
    isLoading?: boolean;
    clickEvent?: AllEvents;
};
const HomeContentContext = createContext<ContextProps>({} as ContextProps);

type ImageProps = {
    rank?: number;
    srcWidth?: number;
    srcHeight?: number;
    showStatus?: boolean;
    classes?: {
        container?: string;
        link?: string;
        badge?: WtuBadgeType['classes'];
        img?: string;
    };
};
const Image = ({ rank, srcWidth, srcHeight, classes, showStatus }: ImageProps) => {
    const { content, isLoading, clickEvent } = useContext(HomeContentContext);
    const { activePricingModelType: pricingModel } = useNovelStatus({ novel: content });
    const { isVisible = true } = useSwiperSlide();
    return (
        <Link
            className={classes?.link}
            to={getNovelPath(content?.slug || '')}
            data-amplitude-click-event={clickEvent ?? HomeEvents.ClickCollectionItem}
        >
            <div className={twMerge('relative h-0 pb-[146%]', classes?.container)}>
                <NovelResponsiveCoverImage
                    novel={content}
                    imgUrl={content?.coverUrl?.value}
                    imgBlurHash={content?.coverBlurHash?.value}
                    isLoading={isLoading}
                    srcWidth={srcWidth ?? 200}
                    srcHeight={srcHeight ?? 292}
                    classes={{
                        bookCover: 'rounded-r-5',
                        img: clsx('rounded-r-5', isVisible && 'drop-shadow-ww-home-content-image', classes?.img),
                    }}
                >
                    {pricingModel === 'waitToUnlock' && (
                        <NovelResponsiveCoverImage.WtuBadge
                            classes={{
                                root: 'bottom-4 right-4 md:bottom-5 md:right-5',
                                box: 'h-24 w-24 md:h-28 md:w-28',
                                icon: 'h-16 w-16 md:h-20 md:w-20',
                                ...classes?.badge,
                            }}
                        />
                    )}
                    {rank !== undefined && <Rank rank={rank} />}
                    {content?.status !== undefined && showStatus !== false && (
                        <div className="font-set-b9 bg-gray-950/50 absolute top-0 rounded-[0_0_4px_0] py-4 px-6 text-white">
                            {convertNovelStatusToStr(content.status)}
                        </div>
                    )}
                </NovelResponsiveCoverImage>
            </div>
        </Link>
    );
};

type RankProps = { rank: number };
const Rank = ({ rank }: RankProps) => {
    const isMobile = useMediaQuery(breakpoints.downMd, {
        noSsr: true,
    });

    return (
        <div className="absolute -bottom-2 -left-2">
            <span
                className={clsx(
                    rankingStyles['ranking-number'],
                    rankingStyles[`ranking-number-${rank + 1}_3x`],
                    isMobile && rankingStyles['ranking-number-mobile']
                )}
            />
        </div>
    );
};

type BannerProps = {
    className?: string;
    color?: string;
    text?: string;
    classes?: {
        text?: string;
    };
};

const Banner = ({ className, classes, text }: BannerProps) => {
    return (
        <div className={twMerge('w-full rounded-b-md', className)}>
            <span className={twMerge('m-4 text-[12px] font-semibold dark:text-white', classes?.text)}>{text}</span>
        </div>
    );
};

type ReviewScoreProps = PropsWithChildren<{
    className?: string;
    classes?: { goodIcon?: string; score?: string };
}>;
const ReviewScore = ({ className, classes, children }: ReviewScoreProps) => {
    const { reviewRating, isLoading } = useContext(HomeContentContext);
    if (reviewRating === undefined) return null;

    return (
        <HeroTextPlaceholder
            item={!isLoading}
            skeletonProps={BASE_SKELETON_PROPS}
            className="h-14 w-48 md:h-16 md:w-64"
        >
            <div className={className}>
                <NovelReviewScore reviewRating={reviewRating} classes={classes ?? HOME_NOVEL_REVIEW_SCORE_STYLE}>
                    {children}
                </NovelReviewScore>
            </div>
        </HeroTextPlaceholder>
    );
};

const Title = ({ className }: ClassNameType) => {
    const { content, isLoading, clickEvent } = useContext(HomeContentContext);
    return (
        <HeroTextPlaceholder
            item={!isLoading}
            count={2}
            className="mt-4 h-12 last:w-96 md:h-14"
            skeletonProps={BASE_SKELETON_PROPS}
        >
            <Link
                to={getNovelPath(content?.slug || '')}
                className={twMerge('line-clamp-2', className)}
                data-amplitude-click-event={clickEvent ?? HomeEvents.ClickCollectionItem}
            >
                {content?.name}
            </Link>
        </HeroTextPlaceholder>
    );
};

const SubTitle = ({ className, subtitle }: { className?: string; subtitle: string }) => {
    return <span className={clsx('text-[#E0E0E0]', className)}>{subtitle}</span>;
};

const TextWrapper = ({ className, children }: PropsWithChildren<ClassNameType>) => {
    return <div className={clsx('text-gray-t2 px-4 pt-4', className)}>{children}</div>;
};

HomeContent.Image = Image;
HomeContent.TextWrapper = TextWrapper;
HomeContent.ReviewScore = ReviewScore;
HomeContent.Title = Title;
HomeContent.SubTitle = SubTitle;
HomeContent.Banner = Banner;

export default HomeContent;
