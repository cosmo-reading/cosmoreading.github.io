import { ReactComponent as ArrowUpIcon } from '@app/assets/arrow-up.svg';
import { ReactComponent as GoodIcon } from '@app/assets/good.svg';
import { ReactComponent as MedalGoldIcon } from '@app/assets/medal-gold.svg';
import { ReactComponent as MedalSilverIcon } from '@app/assets/medal-silver.svg';
import HeroTextPlaceholder from '@app/domains/novel/components/HeroTextPlaceholder';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import { formatRatingForDisplay } from '@app/utils/utils';
import clsx from 'clsx';
import { type ReactNode, createContext, useContext } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    isLoading?: boolean;
    reviewRating?: number;
    reviewCount?: number;
    classes?: { goodIcon?: string; rating?: string; score?: string };
    children?: ReactNode;
};

function NovelReviewScore({ isLoading, reviewRating, classes, children }: Props) {
    const value = { reviewRating };

    return (
        <NovelReviewScoreContext.Provider value={value}>
            <HeroTextPlaceholder
                item={!isLoading}
                count={2}
                className="h-[22px] w-[176px] max-w-full last:mt-0 last:h-0 sm2:mt-[8px]"
                skeletonProps={BASE_SKELETON_PROPS}
            >
                <div className={clsx('flex items-center', classes?.rating)}>
                    {reviewRating !== undefined ? (
                        <>
                            <GoodIcon className={classes?.goodIcon} />
                            <span className={classes?.score}>{formatRatingForDisplay(reviewRating)}</span>
                            {children}
                        </>
                    ) : (
                        <span className="mr-[6px]">Not yet rated</span>
                    )}
                </div>
            </HeroTextPlaceholder>
        </NovelReviewScoreContext.Provider>
    );
}

type ContextProps = {
    reviewRating?: number;
};
const NovelReviewScoreContext = createContext<ContextProps>({});

type MedalIconProps = {
    className?: string;
};
const MedalIcon = ({ className }: MedalIconProps) => {
    const { reviewRating = 0 } = useContext(NovelReviewScoreContext);
    return (
        <>
            {reviewRating >= 0.8 ? (
                <MedalGoldIcon className={className} />
            ) : reviewRating > 0.7 ? (
                <MedalSilverIcon className={className} />
            ) : (
                <div className="w-[6px]" />
            )}
        </>
    );
};

type CountProps = {
    onClick?: () => void;
    count: number | undefined;
    className?: string;
};
const Count = ({ onClick, count, className }: CountProps) => {
    return (
        <div className={twMerge('font-set-sb14 flex items-center sm2:font-set-sb18', className)} onClick={onClick}>
            <span className={clsx(onClick && 'cursor-pointer hover:underline')}>
                {count && count > 0 ? (
                    <>
                        {count} {count > 1 ? 'Reviews' : 'Review'}
                    </>
                ) : (
                    'Leave a review'
                )}
            </span>
            {onClick && (
                <div className="pt-[1px] sm2:pt-[2px]">
                    <ArrowUpIcon className="h-[12px] w-[12px] rotate-90 sm2:h-[16px] sm2:w-[16px]" />
                </div>
            )}
        </div>
    );
};

NovelReviewScore.MedalIcon = MedalIcon;
NovelReviewScore.Count = Count;

export default NovelReviewScore;
