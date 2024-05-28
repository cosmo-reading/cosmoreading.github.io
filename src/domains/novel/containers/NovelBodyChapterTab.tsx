import type { NovelItem } from '@app/_proto/Protos/novels';
import useChampionSubscriptions from '@app/domains/champion/hooks/useChampionSubscriptions';
import useChapterList from '@app/domains/chapter/hooks/useChapterList';
import { ChapterListSortOrder } from '@app/domains/chapter/types';
import { checkHavingAdvChapterAccess } from '@app/domains/chapter/utils';
import Select from '@app/domains/common/components/Select';
import NovelChapterGroupContainer from '@app/domains/novel/components/NovelChapterGroupContainer';
import NovelLatestAnnouncement from '@app/domains/novel/components/NovelLatestAnnouncement';
import NovelLatestChapter from '@app/domains/novel/components/NovelLatestChapter';
import { useAuth } from '@app/libs/auth';
import { decimalToNumber, timestampToUnix } from '@app/libs/utils';
import { useTimeAgo } from '@app/utils/time';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
type NovelChapterTabProps = {
    novel: NovelItem;
};

export default function NovelBodyChapterTab({ novel }: NovelChapterTabProps) {
    const { id: novelId, slug: novelSlug, status: novelStatus } = novel;

    const [sort, setSort] = useState(ChapterListSortOrder.Newest);

    const { activeSubscription: myActiveChampion } = useChampionSubscriptions({
        novelId: novel?.id,
        enabled: !!novel?.id,
    });

    const { user } = useAuth();
    const hasAdvChapterAccess = checkHavingAdvChapterAccess({ user: user ?? undefined, novelId: novel.id });
    const showsAdvChapterGroup = !!myActiveChampion || hasAdvChapterAccess;

    const { data: advChapterList } = useChapterList({
        novel,
        advance: true,
        enabled: novel && showsAdvChapterGroup,
    });
    const advChapters = useMemo(() => advChapterList?.flatMap(list => list.chapterList), [advChapterList]);
    const hasAdvChapter = (advChapters?.length || 0) > 0;

    const chapterGroups = useMemo(() => {
        const cg = Array.from(novel.chapterInfo?.chapterGroups || []);
        const filteredChapterGroups =
            cg.filter(cg => {
                return cg.counts?.advance === 0 || cg.counts?.total !== cg.counts?.advance;
            }) || [];

        return filteredChapterGroups.sort((a, b) =>
            sort === ChapterListSortOrder.Newest ? b.order - a.order : a.order - b.order
        );
    }, [novel.chapterInfo?.chapterGroups, sort]);

    const [chapterGroupTemplate] = chapterGroups;
    const advChapterGroup = {
        ...chapterGroupTemplate,
        id: -1,
        title: 'For Champions',
    };

    const { latestChapter } = novel.chapterInfo || {};
    const latestChapterTimeAgo = useTimeAgo(latestChapter?.whenToPublish ?? latestChapter?.publishedAt, {
        refreshInterval: 0,
    });
    const isRecentlyPublished = useMemo(() => {
        const now = dayjs();
        const timePosted = dayjs.unix(timestampToUnix(latestChapter?.whenToPublish ?? latestChapter?.publishedAt)!);
        return timePosted.isAfter(now.subtract(15, 'day'));
    }, [latestChapter]);
    const latestChapterLink = `/novel/${novel.slug}/${latestChapter?.slug}`;
    const latestChapterNumber = decimalToNumber(latestChapter?.number);

    return (
        <div className="pb-[40px] pt-[12px] md:px-0">
            <NovelLatestAnnouncement
                classes={{ collapse: '-mx-8', root: 'mb-12' }}
                novelId={novelId}
                novelSlug={novelSlug}
                novelStatus={novelStatus}
            />
            {chapterGroups.length > 0 && (
                <div className="mb-[20px] flex flex-row flex-nowrap pt-[8px]">
                    {latestChapter && (
                        <NovelLatestChapter
                            timeAgo={latestChapterTimeAgo}
                            chapterLink={latestChapterLink}
                            chapterNumber={latestChapterNumber}
                            isRecentlyPublished={isRecentlyPublished}
                        />
                    )}
                    <div className="flex flex-1 items-end justify-end md:mt-0">
                        <div>
                            <Select
                                options={[
                                    { text: 'Newest', value: ChapterListSortOrder.Newest },
                                    { text: 'Oldest', value: ChapterListSortOrder.Oldest },
                                ]}
                                onChange={({ value }) => setSort(value as ChapterListSortOrder)}
                                defaultValue={sort}
                            />
                        </div>
                    </div>
                </div>
            )}
            <div>
                {showsAdvChapterGroup && hasAdvChapter && (
                    <NovelChapterGroupContainer
                        advanced
                        index={0}
                        totalLength={chapterGroups.length}
                        novel={novel}
                        chapterGroup={advChapterGroup}
                        initialExpanded={true}
                        sort={sort}
                        chunked
                    />
                )}
                {chapterGroups.map((chapterGroup, idx) => (
                    <NovelChapterGroupContainer
                        key={chapterGroup.id}
                        index={idx}
                        totalLength={chapterGroups.length}
                        novel={novel}
                        chapterGroup={chapterGroup}
                        sort={sort}
                        chunked
                    />
                ))}
            </div>
        </div>
    );
}
