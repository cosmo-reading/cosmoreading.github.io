import { GetSiteAnnouncementsRequest, type SiteAnnouncementItem } from '@app/_proto/Protos/site_announcements';
import { SiteAnnouncementsClient } from '@app/_proto/Protos/site_announcements.client';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useGrpcRequest } from '@app/libs/grpc';
import type { PartialMessage } from '@protobuf-ts/runtime';
import { useMemo } from 'react';

type UseSiteAnnouncementsParam = {
    requestOption?: PartialMessage<GetSiteAnnouncementsRequest>;
    staleTime?: number;
    keepPreviousData?: boolean;
    enabled?: boolean;
    suspense?: boolean;
};

type UseSiteAnnouncementsReturn = {
    data?: SiteAnnouncementItem[];
    totalPages?: number;
    isLoading: boolean;
    isFetching: boolean;
};

export default function useSiteAnnouncements({
    requestOption,
    staleTime = 5 * MINUTE_MS,
    keepPreviousData = true,
    enabled = true,
    suspense = true,
}: UseSiteAnnouncementsParam = {}): UseSiteAnnouncementsReturn {
    const getSiteAnnouncementsRequest = useGrpcRequest(GetSiteAnnouncementsRequest, {
        pageInfo: DEFAULT_PAGINATED_REQUEST_OPTION,
        ...requestOption,
    });

    const { data, isLoading, isFetching } = useGrpcApiWithQuery(
        SiteAnnouncementsClient,
        c => c.getSiteAnnouncements,
        getSiteAnnouncementsRequest,
        ['news', getSiteAnnouncementsRequest.pageInfo?.page, getSiteAnnouncementsRequest.pageInfo?.count],
        {
            suspense,
            staleTime,
            keepPreviousData,
            enabled,
        }
    );

    const totalPages = useMemo(() => {
        return Math.ceil(
            (data?.pageInfo?.total ?? 0) /
                (getSiteAnnouncementsRequest.pageInfo?.count ?? DEFAULT_PAGINATED_REQUEST_OPTION.count)
        );
    }, [data?.pageInfo?.total, getSiteAnnouncementsRequest.pageInfo]);

    return { data: data?.items, totalPages, isLoading, isFetching };
}

const MINUTE_MS = 1000 * 60;
const DEFAULT_PAGINATED_REQUEST_OPTION = {
    page: 1,
    count: 4,
};
