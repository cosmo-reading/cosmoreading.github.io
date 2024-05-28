import { type ChapterGroupItem, GetChapterListRequest, type GetChapterListResponse } from '@app/_proto/Protos/chapters';
import { ChaptersClient } from '@app/_proto/Protos/chapters.client';
import type { NovelItem } from '@app/_proto/Protos/novels';
import { type GrpcApiOptions, useGrpcApiWithQuery } from '@app/libs/api';
import { useAuth } from '@app/libs/auth';
import { useGrpcRequest } from '@app/libs/grpc';
import type { QueryStatus } from '@tanstack/react-query';

type UseChapterListsParam = {
    novel: NovelItem;
    chapterGroup?: ChapterGroupItem;
    advance?: boolean;
} & GrpcApiOptions<GetChapterListRequest, GetChapterListResponse>;

type UseChapterListReturn = {
    data?: ChapterGroupItem[] | undefined;
    status: QueryStatus | 'idle';
};

export default function useChapterList({
    novel,
    chapterGroup,
    advance,
    enabled,
    suspense,
    ...rest
}: UseChapterListsParam): UseChapterListReturn {
    const { user } = useAuth();

    const getChapterListRequest = useGrpcRequest(GetChapterListRequest, {
        novelId: novel?.id,
        filter: {
            isAdvanceChapter:
                advance !== undefined
                    ? {
                          value: advance,
                      }
                    : undefined,
            chapterGroupId: chapterGroup && {
                value: chapterGroup.id,
            },
        },
    });

    const { data, status } = useGrpcApiWithQuery(
        ChaptersClient,
        c => c.getChapterList,
        getChapterListRequest,
        ['chapterGroups', novel?.slug, user?.id, chapterGroup?.id, advance],
        {
            enabled,
            suspense,
            staleTime: 60 * 1000, //Data stale time 60 seconds
            ...rest,
        }
    );

    return { data: data?.items, status };
}
