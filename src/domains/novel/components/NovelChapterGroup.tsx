import { type ChapterGroupItem, GetChapterListRequest } from '@app/_proto/Protos/chapters';
import { ChaptersClient } from '@app/_proto/Protos/chapters.client';
import type { NovelItem } from '@app/_proto/Protos/novels';
import { CHAPTER_EVENT_SOURCES } from '@app/analytics/constants';
import useChampionSubscriptions from '@app/domains/champion/hooks/useChampionSubscriptions';
import { ChapterListSortOrder } from '@app/domains/chapter/types';
import { parseChapterStatus } from '@app/domains/common/utils';
import NovelChapter, { type NovelChapterProps } from '@app/domains/novel/components/NovelChapter';
import useNovelVipBenefit from '@app/domains/novel/hooks/useNovelVipBenefit';
import { determineChapterStatus } from '@app/domains/novel/utils';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useAuth } from '@app/libs/auth';
import { useGrpcRequest } from '@app/libs/grpc';
import clsx from 'clsx';
import { useMemo } from 'react';

type NovelChapterGroupProps = {
    advanced?: boolean;
    novel: NovelItem;
    chapterGroup: ChapterGroupItem;
    sort: ChapterListSortOrder;
    active: boolean;
    chunked: boolean;
};
export default function NovelChapterGroup({
    advanced,
    novel,
    chapterGroup,
    sort,
    active,
    chunked,
}: NovelChapterGroupProps) {
    const { user } = useAuth();
    const chapterListRequest = useGrpcRequest(GetChapterListRequest, {
        novelId: novel.id,
        filter: advanced
            ? {
                  isAdvanceChapter: {
                      value: true,
                  },
              }
            : {
                  chapterGroupId: {
                      value: chapterGroup?.id,
                  },
              },
    });

    const { data: chapterGroupData } = useGrpcApiWithQuery(
        ChaptersClient,
        c => c.getChapterList,
        chapterListRequest,
        ['chapterGroups', novel.slug, user?.id, chapterGroup?.id],
        {
            suspense: true,
            enabled: !!chapterGroup && active,
            staleTime: 1000 * 60 * 5, //Data stales in 5 minutes
            showModalOnError: true,
        }
    );

    const chapters = useMemo(() => {
        if (!chapterGroupData?.items) {
            return [];
        }

        let chapters = advanced
            ? chapterGroupData.items.flatMap(f => f.chapterList)
            : Array.from(chapterGroupData.items[0]?.chapterList || []);

        chapters = sort === ChapterListSortOrder.Newest ? chapters.reverse() : chapters;

        const advFilteredChapters = (() => {
            if (advanced) return chapters.filter(chapter => parseChapterStatus(chapter).isAdvancedChapter);
            return chapters.filter(chapter => !parseChapterStatus(chapter).isAdvancedChapter);
        })();

        return advFilteredChapters;
    }, [chapterGroupData?.items, sort, advanced]);

    const { isVipBenefit: isVipBenefitNovel } = useNovelVipBenefit(novel);

    const { slug: novelSlug } = novel;

    return (
        <div className="md:px-0">
            <div
                className={clsx(
                    {
                        'grid grid-cols-1 md:grid-cols-2 md:gap-x-[20px]': chunked,
                    },
                    'w-full'
                )}
            >
                {chapters.map((chapter, idx) => (
                    <BorderedNovelChapter
                        key={chapter.entityId}
                        idx={idx}
                        chaptersLength={chapters.length}
                        novelSlug={novelSlug}
                        novel={novel}
                        chapter={chapter}
                        isVipBenefitNovel={isVipBenefitNovel}
                    />
                ))}

                {chapterGroupData && chapters.length === 0 && (
                    <div className="py-[12px]">Chapters coming soon. Keep watching this space.</div>
                )}
            </div>
        </div>
    );
}

type BorderedNovelChapterProps = {
    idx: number;
    chaptersLength: number;
    novel: NovelItem;
    isVipBenefitNovel: boolean;
} & Omit<NovelChapterProps, 'status' | 'renderedFrom'>;

const BorderedNovelChapter = ({
    idx,
    chaptersLength,
    novel,
    chapter,
    isVipBenefitNovel,
    ...props
}: BorderedNovelChapterProps) => {
    const totalLineIdx = Math.ceil(chaptersLength / 2) - 1;
    const lineIdx = Math.floor(idx / 2);
    const isLastLine = lineIdx === totalLineIdx;

    const { activeSubscription } = useChampionSubscriptions({
        novelId: novel?.id,
        enabled: !!novel?.id,
    });

    const status = determineChapterStatus({ novel, chapter, isVipBenefitNovel, championedNovel: !!activeSubscription });

    return (
        <div
            style={
                {
                    contentVisibility: 'auto',
                    containIntrinsicSize: '61.0312px',
                } as any
            }
            className={clsx('border-b border-gray-line-base', isLastLine && 'md:border-b-0')}
            data-amplitude-params={JSON.stringify({
                on: CHAPTER_EVENT_SOURCES.NovelCover,
            })}
        >
            <NovelChapter
                chapter={chapter}
                status={status}
                renderedFrom={CHAPTER_EVENT_SOURCES.NovelCover}
                {...props}
            />
        </div>
    );
};
