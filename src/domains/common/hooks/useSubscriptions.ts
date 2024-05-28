import {
    GetSubscriptionsRequest,
    GetSubscriptionsRequest_Type,
    type SubscriptionItem,
} from '@app/_proto/Protos/subscriptions';
import { SubscriptionsClient } from '@app/_proto/Protos/subscriptions.client';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useAuth } from '@app/libs/auth';
import { getOneofValue, useGrpcRequest } from '@app/libs/grpc';
import type { PartialMessage } from '@protobuf-ts/runtime';
import type { UseQueryResult } from '@tanstack/react-query';

type UseSubscriptionsParam = {
    enabled?: boolean;
    keepPreviousData?: boolean;
    type?: GetSubscriptionsRequest_Type;
    novelId?: number;
    showModalOnError?: boolean;
    suspense?: boolean;
};

type UseSubscriptionsReturn = {
    data?: SubscriptionItem[];
    isLoading: boolean;
    isPending: boolean;
    isSuccess: boolean;
    queryResult: UseQueryResult;
    invalidateQuery: () => Promise<void>;
};

export default function useSubscriptions({
    enabled,
    keepPreviousData,
    type,
    novelId,
    suspense,
    showModalOnError,
}: UseSubscriptionsParam): UseSubscriptionsReturn {
    const { user, loaded: userLoaded } = useAuth();

    const subscriptionRequestQueryParams: PartialMessage<GetSubscriptionsRequest> = {
        type: type ?? GetSubscriptionsRequest_Type.All,
        ...(novelId
            ? {
                  selector: {
                      oneofKind: 'novelId',
                      novelId,
                  },
              }
            : undefined),
    };

    const getSubscriptionsRequest = useGrpcRequest(GetSubscriptionsRequest, subscriptionRequestQueryParams);

    const { data, isLoading, isSuccess, invalidateQuery, queryResult } = useGrpcApiWithQuery(
        SubscriptionsClient,
        c => c.getSubscriptions,
        getSubscriptionsRequest,
        [
            'subscriptions',
            subscriptionRequestQueryParams.type,
            user?.id,
            getOneofValue(subscriptionRequestQueryParams.selector, 'novelId'),
        ],
        {
            suspense: suspense ?? false,
            enabled: enabled !== undefined ? !!user && enabled : !!user,
            keepPreviousData: keepPreviousData ?? true,
            showModalOnError,
        }
    );

    return {
        data: data?.items,
        queryResult,
        isLoading,
        isPending: !userLoaded && queryResult.isLoading,
        isSuccess,
        invalidateQuery,
    };
}
