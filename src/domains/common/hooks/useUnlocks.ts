import { GetUnlocksRequest, UnlockItemType, type UnlockedItem } from '@app/_proto/Protos/unlocks';
import { UnlocksClient } from '@app/_proto/Protos/unlocks.client';
import { LIMITED_VIP_TYPES } from '@app/domains/common/constants';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { type User, useAuth } from '@app/libs/auth';
import { useGrpcRequest } from '@app/libs/grpc';
import type { PartialMessage } from '@protobuf-ts/runtime';
import type { UseQueryResult } from '@tanstack/react-query';

type UseUnlocksParam = {
    user?: User;
    requestOption?: PartialMessage<GetUnlocksRequest>;
    enabled?: boolean;
    staleTime?: number;
    cacheTime?: number;
};

type UseUnlocksReturn = {
    data?: UnlockedItem[];
    isLoading: boolean;
    isPending: boolean;
    queryResult: UseQueryResult;
};

export default function useUnlocks({
    requestOption = {},
    enabled,
    staleTime,
    cacheTime,
}: UseUnlocksParam = {}): UseUnlocksReturn {
    const { user, loaded: userLoaded } = useAuth();
    const unlocksRequest = useGrpcRequest(GetUnlocksRequest, {
        type: UnlockItemType.UnlockItemNovel,
        pageInfo: {
            page: 1,
            count: 100,
        },
        ...requestOption,
    });

    const { data, isLoading, queryResult } = useGrpcApiWithQuery(
        UnlocksClient,
        c => c.getUnlocks,
        unlocksRequest,
        ['unlocks', user?.id, 'novels'],
        {
            enabled: enabled ?? !!(user?.isVipActive && LIMITED_VIP_TYPES.includes(user?.vip?.type ?? -1)),
            staleTime: staleTime ?? 0,
            cacheTime: cacheTime ?? 0,
            refetchOnWindowFocus: false,
        }
    );

    return {
        data: data?.items,
        isLoading,
        isPending: !userLoaded && queryResult.isLoading,
        queryResult,
    };
}
