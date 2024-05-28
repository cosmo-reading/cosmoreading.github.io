import type { ChapterItem } from '@app/_proto/Protos/chapters';
import { ReactComponent as Lock } from '@app/assets/lock.svg';
import { ReactComponent as Unlock } from '@app/assets/unlock.svg';
import { ReactComponent as WtuTimerIcon } from '@app/assets/wtu-timer.svg';
import { ChapterEvents } from '@app/domains/chapter/analytics/amplitude/events';
import { chapterCommonLoggingParamsParser } from '@app/domains/chapter/analytics/amplitude/handlers';
import { useNavInterceptor } from '@app/domains/common/hooks/useNavInterceptor';
import { parseChapterStatus } from '@app/domains/common/utils';
import { getChapterPath } from '@app/domains/common/utils/path';
import NovelChapterSubText from '@app/domains/novel/components/NovelChapterSubText';
import type { ChapterItemStatus } from '@app/domains/novel/types';
import { timestampToDate } from '@app/libs/utils';
import clsx from 'clsx';
import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

export type NovelChapterProps = {
    classes?: {
        root?: string;
        title?: string;
    };
    novelSlug: string;
    chapter: ChapterItem;
    status: ChapterItemStatus;
    onClickItem?: () => void;
    itemId?: string;
    renderedFrom?: string;
};

export default function NovelChapter({
    classes,
    novelSlug,
    chapter,
    status,
    onClickItem,
    itemId,
    renderedFrom,
}: NovelChapterProps) {
    const { slug: chapterSlug, name: chapterName } = chapter;
    const publishedDate = timestampToDate(chapter.whenToPublish ?? chapter.publishedAt) ?? undefined;
    const isSpoilerTitle = chapter.spoilerTitle;
    const { isAdvancedChapter: advanced } = parseChapterStatus(chapter);

    const shouldPayKarma = ['lockedByKarma', 'lockedByLastHoldBack', 'lockedByWtu'].includes(status);
    const karmaPrice = chapter.karmaInfo?.karmaPrice?.value;
    const isOwned = status === 'unlockedByOwned';

    const to = getChapterPath({ novelSlug, chapterSlug });
    const { intercepted: clicked, intercept } = useNavInterceptor({ to, from: renderedFrom });
    return (
        <Link
            to={to}
            onClick={(e: MouseEvent<HTMLElement>) => {
                intercept(e);
                onClickItem?.();
            }}
            className="group"
            data-amplitude-click-event={ChapterEvents.ClickChapter}
            data-amplitude-params={JSON.stringify(chapterCommonLoggingParamsParser(chapter))}
        >
            <div
                id={itemId}
                className={twMerge(
                    clsx(
                        'flex pt-[12px] pb-[10px] md:last-of-type:border-b-0 with-hover:hover:bg-black/[.04] with-hover:hover:dark:bg-white/[.08]',
                        { 'bg-black/[.04] dark:bg-white/[.08]': clicked }
                    ),
                    classes?.root
                )}
            >
                <div className="flex-1">
                    <div
                        className={clsx(
                            'font-set-sb16 group-visited:text-gray-400 dark:group-visited:text-gray-600',
                            twMerge('text-gray-800 line-clamp-1 dark:text-white', classes?.title)
                        )}
                    >
                        {!isSpoilerTitle && <span>{chapterName}</span>}
                        {isSpoilerTitle && (
                            <>
                                <span className="text-spoiler">{chapterName}</span> (Spoiler Title)
                            </>
                        )}
                    </div>
                    <div className="mt-[4px]">
                        <NovelChapterSubText
                            publishedDate={publishedDate}
                            isOwned={isOwned}
                            advanced={advanced}
                            shouldPayKarma={shouldPayKarma}
                            karmaPrice={karmaPrice}
                        />
                    </div>
                </div>
                <div className="ml-[4px] flex items-center" role="status">
                    <StatusIcon status={status} />
                </div>
            </div>
        </Link>
    );
}

const StatusIcon = ({ status }) => {
    if (status === 'lockedByKarma' || status === 'lockedByLastHoldBack' || status === 'lockedByAdvanced') {
        return (
            <div title="locked">
                <Lock className="h-[18px] w-[18px] text-gray-400 dark:text-gray-500" />
            </div>
        );
    }
    if (status === 'lockedByWtu') {
        return (
            <div title="wait">
                <WtuTimerIcon className="h-[18px] w-[18px] text-gray-400" />
            </div>
        );
    }
    if (status === 'unlockedByVip' || status === 'unlockedByChampion') {
        return (
            <div title="unlocked">
                <Unlock className="h-[18px] w-[18px] text-blue-500" />
            </div>
        );
    }
    if (status === 'unlockedByFree' || status === 'unlockedByOwned' || status === 'unlockedByUnknown') {
        return null;
    }
    return null;
};
