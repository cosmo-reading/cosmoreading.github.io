import { GetNovelRequest, type NovelItem } from '@app/_proto/Protos/novels';
import { NovelsClient } from '@app/_proto/Protos/novels.client';
import { novelQueryKeyFactory } from '@app/domains/novel/query';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useGrpcRequest } from '@app/libs/grpc';
import type { QueryStatus } from '@tanstack/react-query';
import { useEffect } from 'react';

type UseNovelParam = {
    novelSlug: string;
    userId?: string;
    enabled?: boolean;
    suspense?: boolean;
    showModalOnError?: boolean;
    noItemHandler?: () => void;
};

type UseNovelReturn = {
    data?: NovelItem;
    status: QueryStatus | 'idle';
};

export default function useNovel({
    novelSlug,
    userId,
    enabled,
    suspense = true,
    showModalOnError = false,
    noItemHandler,
}: UseNovelParam): UseNovelReturn {
    const novelRequest = useGrpcRequest(GetNovelRequest, {
        selector: {
            oneofKind: 'slug',
            slug: novelSlug,
        },
    });
    const { data, status } = useGrpcApiWithQuery(
        NovelsClient,
        c => c.getNovel,
        novelRequest,
        novelQueryKeyFactory.novel({ novelSlug, userId }),
        {
            enabled: enabled ?? !!novelSlug,
            staleTime: Number.POSITIVE_INFINITY, //Data never stales
            suspense,
            showModalOnError,
        }
    );
    useEffect(() => {
        if (data && !data.item) {
            noItemHandler?.();
        }
    }, [data, noItemHandler]);
    return {
        data: data?.item,
        status,
    };
}
