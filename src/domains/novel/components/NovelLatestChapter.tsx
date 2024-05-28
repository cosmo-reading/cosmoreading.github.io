import { CHAPTER_EVENT_SOURCES } from '@app/analytics/constants';
import { Link } from 'react-router-dom';

type NovelLatestChapterProps = {
    timeAgo: string | null;
    chapterLink: string;
    chapterNumber?: number;
    isRecentlyPublished?: boolean;
};
export default function NovelLatestChapter({
    timeAgo,
    chapterLink,
    chapterNumber,
    isRecentlyPublished = false,
}: NovelLatestChapterProps) {
    return (
        <div>
            <div className="font-set-m12 text-gray-600 md:font-set-m15 dark:text-gray-400">Latest Chapter</div>
            <div className="mt-[4px] flex flex-wrap items-center">
                <div className="mr-[6px] flex">
                    <Link
                        to={chapterLink}
                        state={{ from: CHAPTER_EVENT_SOURCES.NovelCover }}
                        className="font-set-sb16 text-gray-t1 md:font-set-sb18"
                        data-testid="chapter-number"
                    >
                        Chapter {chapterNumber}
                    </Link>
                    {isRecentlyPublished && (
                        <div className="relative ml-[2px] w-[6px]">
                            <span
                                data-testid="recent-dot"
                                className="absolute top-[4px] inline-block h-[6px] w-[6px] rounded-full bg-blue-600"
                            ></span>
                        </div>
                    )}
                </div>
                <div data-testid="time-ago" className="font-set-r13 text-gray-600 md:font-set-r14 dark:text-gray-400">
                    {timeAgo}
                </div>
            </div>
        </div>
    );
}
