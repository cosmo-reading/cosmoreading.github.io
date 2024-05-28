import type { NovelItem } from '@app/_proto/Protos/novels';
import type { ProductItem } from '@app/_proto/Protos/products';
import { type ReviewItem, ReviewItem_VoteType } from '@app/_proto/Protos/reviews';
import { ReactComponent as GoodFillIcon } from '@app/assets/good-fill.svg';
import { ReactComponent as GoodIcon } from '@app/assets/good.svg';
import { ReactComponent as ReplyIcon } from '@app/assets/reply.svg';
import LazyAvatar, { type LazyAvatarProps } from '@app/components/lazy-avatar';
import ReviewCommentsComponent from '@app/components/reviews/review.comments';
import UserBadge from '@app/components/user.badge';
import ChampionAvatarFrame from '@app/domains/champion/components/ChampionAvatarFrame';
import TruncateDisclosure from '@app/domains/common/components/TruncateDisclosure';
import TruncateShowOrHide from '@app/domains/common/components/TruncateShowOrHide';
import { ABSOLUTE_FULL } from '@app/domains/common/styles';
import type { ClassNameType } from '@app/domains/common/types';
import UserFlairBadge from '@app/domains/user/components/UserFlairBadge';
import { breakpoints } from '@app/utils/breakpoints';
import { Paragraph, useHtmlToReact } from '@app/utils/html';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import React, { type ButtonHTMLAttributes, type ComponentType } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    isChampionReviewer?: boolean;
    review: ReviewItem;
    edited?: boolean;
    reviewDateFromNow?: string;
    reviewHtmlContent?: string;
    upVoteCount: number;
    downVoteCount: number;
    onClickUpVote?: () => void;
    onClickDownVote?: () => void;
    entity?: NovelItem | ProductItem;
    onVote?: () => void;
    disableReply?: boolean;
    withBox?: boolean;
};
export default function ReviewCard({
    isChampionReviewer,
    review,
    edited,
    reviewDateFromNow,
    reviewHtmlContent,
    upVoteCount,
    downVoteCount,
    onClickUpVote,
    onClickDownVote,
    entity,
    onVote,
    disableReply,
    withBox = true,
}: Props) {
    const isMobile = useMediaQuery(breakpoints.downSm2, {
        noSsr: true,
    });

    return (
        <article className={clsx('rounded-12 dark:bg-gray-950', withBox && 'shadow-ww-text-container')}>
            <div className="p-16 pb-12">
                {isMobile ? (
                    <>
                        <div className="flex pb-10">
                            <AvatarSection
                                isChampionReviewer={isChampionReviewer}
                                review={review}
                                isMobile={isMobile}
                            />
                            <div className="ml-8 min-w-0 sm2:ml-0">
                                <UserSection review={review} reviewDateFromNow={reviewDateFromNow} edited={edited} />
                            </div>
                        </div>
                        <ContentSection
                            entity={entity}
                            review={review}
                            reviewHtmlContent={reviewHtmlContent}
                            upVoteCount={upVoteCount}
                            downVoteCount={downVoteCount}
                            disableReply={disableReply}
                            onVote={onVote}
                            onClickUpVote={onClickUpVote}
                            onClickDownVote={onClickDownVote}
                        />
                    </>
                ) : (
                    <div className="flex">
                        <AvatarSection isChampionReviewer={isChampionReviewer} review={review} isMobile={isMobile} />
                        <div className="min-w-0 sm2:ml-12">
                            <div className="ml-8 sm2:ml-0">
                                <UserSection review={review} reviewDateFromNow={reviewDateFromNow} edited={edited} />
                            </div>
                            <ContentSection
                                entity={entity}
                                review={review}
                                reviewHtmlContent={reviewHtmlContent}
                                upVoteCount={upVoteCount}
                                downVoteCount={downVoteCount}
                                disableReply={disableReply}
                                onVote={onVote}
                                onClickUpVote={onClickUpVote}
                                onClickDownVote={onClickDownVote}
                            />
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}

const AvatarSection = ({
    isChampionReviewer,
    review,
    isMobile,
}: Pick<Props, 'isChampionReviewer' | 'review'> & { isMobile: boolean }) => (
    <Avatar
        isChampion={isChampionReviewer}
        frameWidth={isMobile ? 2 : 3}
        src={review?.reviewUser?.avatarUrl?.value}
        className="h-40 w-40 sm2:h-60 sm2:w-60"
        variant="rounded"
        frameClasses={{ badge: 'w-30 h-14 sm2:w-34 sm2:h-16' }}
        imageRenderSize={isChampionReviewer ? 54 : 60}
    />
);

const UserSection = ({ review, reviewDateFromNow, edited }: Pick<Props, 'review' | 'reviewDateFromNow' | 'edited'>) => (
    <>
        <div className="flex items-center pt-2">
            <div className="font-set-b14 truncate text-gray-t1 sm2:font-set-b16">
                {review.reviewUser?.userName || '[Unknown Account]'}
            </div>
            {review.reviewUser?.flair?.value && <UserFlairBadge flair={review.reviewUser.flair.value} />}
            {review.reviewUser?.isVipActive && (
                <div className="ml-2 sm2:ml-4">
                    <UserBadge badgeType="vip" vipType={review.reviewUser.vip?.type} />
                </div>
            )}
        </div>
        <div className="font-set-r12 flex pt-2 text-gray-desc sm2:font-set-r13">
            <span>{reviewDateFromNow}</span>
            {edited && (
                <>
                    <TextConnector />
                    <span>Edited</span>
                </>
            )}
        </div>
    </>
);

const ContentSection = ({
    entity,
    review,
    reviewHtmlContent,
    upVoteCount,
    downVoteCount,
    disableReply,
    onVote,
    onClickUpVote,
    onClickDownVote,
}: Pick<
    Props,
    | 'entity'
    | 'review'
    | 'reviewHtmlContent'
    | 'upVoteCount'
    | 'downVoteCount'
    | 'disableReply'
    | 'onVote'
    | 'onClickUpVote'
    | 'onClickDownVote'
>) => {
    const reviewContent = useHtmlToReact(reviewHtmlContent || '', {
        transform: {
            p: Paragraph,
        },
    });
    return (
        <div className="sm2:pt-12">
            <div className="flex items-center pb-2 sm2:pb-0">
                <RecommendOrNot recommended={review.voteType === ReviewItem_VoteType.ThumbsUp} />
                {review.hasPurchased && (
                    <div className="ml-6">
                        <UserBadge badgeType="purchased" />
                    </div>
                )}
            </div>
            <TruncateDisclosure>
                <TruncateDisclosure.Content className="font-set-r15-h150 text-gray-t1 sm2:font-set-r16-h150" lines={3}>
                    {reviewContent}
                </TruncateDisclosure.Content>
                <TruncateDisclosure.Toggle
                    className="font-set-m12 mt-6"
                    showingComponent={<TruncateShowOrHide showing={true} />}
                    hidingComponent={<TruncateShowOrHide showing={false} />}
                />
            </TruncateDisclosure>
            <div className="flex pt-12">
                <div className="py-6 pr-12">
                    <CountWithIconButton count={upVoteCount} onClick={onClickUpVote} IconComponent={GoodIcon} />
                </div>
                <div className="py-6 pr-12">
                    <CountWithIconButton
                        classes={{ icon: 'rotate-180' }}
                        count={downVoteCount}
                        onClick={onClickDownVote}
                        IconComponent={GoodIcon}
                    />
                </div>

                <div>
                    <ReviewCommentsComponent
                        review={review}
                        OpenerComponent={
                            <div className="py-6 pr-12">
                                <CountWithIconButton
                                    count={review.totalComments}
                                    IconComponent={ReplyIcon}
                                    disabled={disableReply}
                                />
                            </div>
                        }
                        onVote={onVote}
                        entity={entity}
                    />
                </div>
            </div>
        </div>
    );
};

type AvatarProps = ClassNameType & {
    isChampion?: boolean;
    frameWidth?: number;
    frameClasses?: { badge?: string };
} & LazyAvatarProps;

const Avatar = ({ isChampion, frameWidth, frameClasses, className, ...lazyAvatarProps }: AvatarProps) => {
    return isChampion ? (
        <ChampionAvatarFrame frameWidth={frameWidth} classes={frameClasses}>
            <LazyAvatar {...lazyAvatarProps} className="h-36 w-36 border-none sm2:h-54 sm2:w-54" />
        </ChampionAvatarFrame>
    ) : (
        <div className="relative">
            <LazyAvatar {...lazyAvatarProps} className={twMerge(className, 'rounded-6 border-none sm2:rounded-8')} />
            <div
                className={twMerge(
                    ABSOLUTE_FULL,
                    className,
                    'rounded-6 ring-[0.5px] ring-inset ring-black/10 sm2:rounded-8'
                )}
            />
        </div>
    );
};

const TextConnector = () => {
    return <div className="w-10 text-center">&middot;</div>;
};

type RecommendOrNotProps = {
    recommended: boolean;
};
const RecommendOrNot = ({ recommended }: RecommendOrNotProps) => {
    const text = recommended ? 'Recommended' : 'Not recommended';
    return (
        <div className={clsx('flex items-center', recommended ? 'text-green-600' : 'text-red-700')}>
            <GoodFillIcon className={clsx('h-18 w-18', !recommended && 'rotate-180')} />
            <span className="font-set-b15 pl-4 font-extrabold italic sm2:font-set-b16 sm2:font-extrabold sm2:italic">
                {text}
            </span>
        </div>
    );
};

type CountWithIconButtonProps = {
    IconComponent: ComponentType<ClassNameType>;
    classes?: { icon?: string };
    count: number;
} & ButtonHTMLAttributes<HTMLButtonElement>;
const CountWithIconButton = ({ IconComponent, classes, count, disabled, ...props }: CountWithIconButtonProps) => {
    return (
        <button
            className={clsx(
                'flex text-gray-t3',
                !disabled ? 'hover:text-blue-600 dark:hover:text-blue-600' : 'cursor-auto'
            )}
            onClick={e => {
                if (disabled) e.stopPropagation();
            }}
            {...props}
        >
            <IconComponent className={clsx('h-16 w-16', classes?.icon)} />
            <span className="font-set-m14 pl-4">{count}</span>
        </button>
    );
};
