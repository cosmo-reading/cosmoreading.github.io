import { GetNovelAnnouncementsRequest, type NovelAnnouncementItem } from '@app/_proto/Protos/novel_announcements';
import { NovelAnnouncementsClient } from '@app/_proto/Protos/novel_announcements.client';
import { NovelItem_Status } from '@app/_proto/Protos/novels';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useGrpcRequest } from '@app/libs/grpc';

type UseNovelAnnouncementsParam = {
    novelId: number;
    novelStatus: NovelItem_Status;
    isSponsorsOnly?: boolean;
    enabled?: boolean;
    suspense?: boolean;
};

type UseNovelAnnouncementsReturn = {
    data?: NovelAnnouncementItem[];
    isFetching: boolean;
};

export default function useNovelAnnouncements({
    novelId,
    novelStatus,
    isSponsorsOnly,
    suspense = false,
    enabled = true,
}: UseNovelAnnouncementsParam): UseNovelAnnouncementsReturn {
    const novelNewsRequest = useGrpcRequest(GetNovelAnnouncementsRequest, {
        novelSelector: {
            oneofKind: 'novelId',
            novelId: novelId,
        },
        pageInfo: {
            page: 1,
            count: 1,
        },
        filter: {
            isSponsorsOnly: isSponsorsOnly !== undefined ? { value: isSponsorsOnly } : undefined,
        },
    });
    const { data, isFetching } = useGrpcApiWithQuery(
        NovelAnnouncementsClient,
        c => c.getNovelAnnouncements,
        novelNewsRequest,
        ['novel-news', novelId, { isSponsorsOnly }, 1, 1],
        {
            suspense,
            enabled: enabled && novelStatus === NovelItem_Status.Active,
            cacheTime: 1000 * 60 * 60, //Data cached for an hour
            staleTime: 1000 * 60 * 60, //Data stales in 1 hour
            keepPreviousData: true,
        }
    );

    return {
        data: data?.items,
        isFetching,
    };
}
