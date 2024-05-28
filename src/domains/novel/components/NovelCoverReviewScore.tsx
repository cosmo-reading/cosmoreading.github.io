import { ReactComponent as ArrowUpIcon } from '@app/assets/arrow-up.svg';
import { ReactComponent as GoodIcon } from '@app/assets/good.svg';
import { ReactComponent as MedalGoldIcon } from '@app/assets/medal-gold.svg';
import { ReactComponent as MedalSilverIcon } from '@app/assets/medal-silver.svg';
import HeroTextPlaceholder from '@app/domains/novel/components/HeroTextPlaceholder';
import { BASE_SKELETON_PROPS } from '@app/domains/novel/constants';
import { formatRatingForDisplay } from '@app/utils/utils';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type Props = {
    classes?: { rating?: string; goodIcon?: string; reviewCount?: string; medal?: string };
    isLoading?: boolean;
    reviewRating?: number;
    reviewCount?: number;
    onReviewClick?: () => void;
};

export default function NovelCoverReviewScore({ classes, isLoading, reviewRating, reviewCount, onReviewClick }: Props) {
    return (
        <HeroTextPlaceholder
            item={!isLoading}
            count={2}
            className="h-[22px] w-[176px] max-w-full last:mt-0 last:h-0 sm2:mt-[8px]"
            skeletonProps={BASE_SKELETON_PROPS}
        >
            <div className="font-set-sb18 flex items-center text-gray-t1 sm2:font-set-sb20">
                {reviewRating !== undefined ? (
                    <span className={twMerge('flex items-center', classes?.rating)}>
                        <GoodIcon
                            className={twMerge(
                                'h-[16px] w-[16px] text-gray-t0 sm2:h-[20px] sm2:w-[20px]',
                                classes?.goodIcon
                            )}
                        />
                        <span className="ml-[4px]">{formatRatingForDisplay(reviewRating)}</span>
                        <ReviewGrade className={classes?.medal} rating={reviewRating * 100} />
                    </span>
                ) : (
                    <span className="mr-[6px]">Not yet rated</span>
                )}
                <div
                    className={twMerge(
                        'font-set-sb14 ml-[2px] flex items-center sm2:font-set-sb18',
                        classes?.reviewCount
                    )}
                    onClick={onReviewClick}
                >
                    <span className={clsx(onReviewClick && 'cursor-pointer hover:underline')}>
                        {reviewCount && reviewCount > 0 ? (
                            <>
                                {reviewCount} {reviewCount > 1 ? 'Reviews' : 'Review'}
                            </>
                        ) : (
                            'Leave a review'
                        )}
                    </span>
                    {onReviewClick && (
                        <div className="pt-[1px] sm2:pt-[2px]">
                            <ArrowUpIcon className="h-[12px] w-[12px] rotate-90 sm2:h-[16px] sm2:w-[16px]" />
                        </div>
                    )}
                </div>
            </div>
        </HeroTextPlaceholder>
    );
}

type ReviewGradeProps = {
    rating: number;
    className?: string;
};

function ReviewGrade({ rating, className }: ReviewGradeProps) {
    return (
        <>
            {rating >= 80 ? (
                <MedalGoldIcon className={twMerge('h-[20px] w-[20px]', className)} />
            ) : rating > 70 ? (
                <MedalSilverIcon className={twMerge('h-[20px] w-[20px]', className)} />
            ) : (
                <div className="w-[6px]" />
            )}
        </>
    );
}
