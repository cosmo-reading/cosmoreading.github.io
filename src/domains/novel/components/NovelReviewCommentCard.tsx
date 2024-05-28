import type { ReviewCommentItem } from '@app/_proto/Protos/review_comments';
import { ReactComponent as Pin } from '@app/assets/pin.svg';
import LazyAvatar, { type LazyAvatarProps } from '@app/components/lazy-avatar';
import UserBadge from '@app/components/user.badge';
import ChampionAvatarFrame from '@app/domains/champion/components/ChampionAvatarFrame';
import TruncateDisclosure from '@app/domains/common/components/TruncateDisclosure';
import TruncateShowOrHide from '@app/domains/common/components/TruncateShowOrHide';
import { ABSOLUTE_FULL } from '@app/domains/common/styles';
import UserFlairBadge from '@app/domains/user/components/UserFlairBadge';
import { breakpoints } from '@app/utils/breakpoints';
import { paragraphTransform, useHtmlToReact } from '@app/utils/html';
import { useMediaQuery } from '@mui/material';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

type Props = {
    isChampionCommenter?: boolean;
    comment: ReviewCommentItem;
    commentDateFromNow?: string;
    commentHtmlContent?: any;
    withBox?: boolean;
};
export default function NovelReviewCommentCard({
    isChampionCommenter,
    comment,
    commentDateFromNow,
    commentHtmlContent,
    withBox = true,
}: Props) {
    const isMobile = useMediaQuery(breakpoints.downSm2, {
        noSsr: true,
    });

    return (
        <article className={clsx(withBox && 'rounded-12 shadow-ww-text-container dark:bg-gray-950')}>
            <div className="py-8">
                {isMobile ? (
                    <>
                        <div className="flex pb-10">
                            <AvatarSection
                                isChampionCommenter={isChampionCommenter}
                                comment={comment}
                                isMobile={isMobile}
                            />
                            <div className="ml-8 min-w-0 sm2:ml-0">
                                <HeadingSection comment={comment} commentDateFromNow={commentDateFromNow} />
                            </div>
                        </div>
                        <ContentSection commentHtmlContent={commentHtmlContent} />
                    </>
                ) : (
                    <div className="flex">
                        <AvatarSection
                            isChampionCommenter={isChampionCommenter}
                            comment={comment}
                            isMobile={isMobile}
                        />
                        <div className="w-full min-w-0 sm2:ml-12">
                            <div className="ml-8 sm2:ml-0">
                                <HeadingSection comment={comment} commentDateFromNow={commentDateFromNow} />
                            </div>
                            <ContentSection commentHtmlContent={commentHtmlContent} />
                        </div>
                    </div>
                )}
            </div>
        </article>
    );
}

const AvatarSection = ({
    isChampionCommenter,
    comment,
    isMobile,
}: Pick<Props, 'isChampionCommenter' | 'comment'> & { isMobile: boolean }) => (
    <Avatar
        isChampion={isChampionCommenter}
        frameWidth={isMobile ? 2 : 3}
        src={comment.commenter?.avatarUrl?.value}
        className="h-40 w-40 sm2:h-60 sm2:w-60"
        variant="rounded"
        frameClasses={{ badge: 'w-30 h-14 sm2:w-34 sm2:h-16' }}
        imageRenderSize={isChampionCommenter ? 54 : 60}
    />
);

const HeadingSection = ({ comment, commentDateFromNow }: Pick<Props, 'comment' | 'commentDateFromNow'>) => (
    <>
        <div className="flex items-center pt-2">
            <div className="font-set-b14 truncate text-gray-t1 sm2:font-set-b16">
                {comment.commenter?.userName || '[Unknown Account]'}
            </div>
            {comment.commenter?.flair?.value && <UserFlairBadge flair={comment.commenter.flair.value} />}
            {comment.commenter?.isVipActive && (
                <div className="ml-2 sm2:ml-4">
                    <UserBadge badgeType="vip" vipType={comment.commenter.vip?.type} />
                </div>
            )}
        </div>
        <div className="font-set-r12 flex pt-2 text-gray-desc sm2:font-set-r13">
            <span>{commentDateFromNow}</span>
            {comment.isSticky && (
                <>
                    <TextConnector />
                    <div className="flex items-center text-blue-600">
                        <Pin className="h-12 w-12" />
                        <span>Pinned</span>
                    </div>
                </>
            )}
        </div>
    </>
);

const ContentSection = ({ commentHtmlContent }: Pick<Props, 'commentHtmlContent'>) => {
    const commentContent = useHtmlToReact(commentHtmlContent || '', {
        transform: {
            p: paragraphTransform,
        },
    });
    return (
        <div className="rounded-12 bg-gray-container-base px-12 py-8 sm2:mt-8">
            <TruncateDisclosure>
                <TruncateDisclosure.Content lines={6}>{commentContent}</TruncateDisclosure.Content>
                <TruncateDisclosure.Toggle
                    className="font-set-m12 mt-6 mb-2"
                    showingComponent={<TruncateShowOrHide showing={true} />}
                    hidingComponent={<TruncateShowOrHide showing={false} />}
                />
            </TruncateDisclosure>
        </div>
    );
};

type AvatarProps = {
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
