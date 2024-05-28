import { GetSubscriptionsRequest_Type, type SubscriptionItem } from '@app/_proto/Protos/subscriptions';
import useSubscriptions from '@app/domains/common/hooks/useSubscriptions';
import type { UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';

type UseChampionSubscriptionsParam = {
    novelId?: number;
    enabled?: boolean;
    suspense?: boolean;
    keepPreviousData?: boolean;
    showModalOnError?: boolean;
};

type UseChampionSubscriptionsReturn = {
    data: SubscriptionItem[] | undefined;
    activeSubscription: SubscriptionItem | undefined;
    isLoading: boolean;
    isPending: boolean;
    isSuccess: boolean;
    queryResult: UseQueryResult;
    invalidateQuery: () => Promise<void>;
};

export default function useChampionSubscriptions({
    novelId,
    enabled,
    suspense,
    keepPreviousData,
    showModalOnError,
}: UseChampionSubscriptionsParam = {}): UseChampionSubscriptionsReturn {
    const { data: subscriptions, ...rest } = useSubscriptions({
        enabled,
        suspense,
        keepPreviousData,
        type: GetSubscriptionsRequest_Type.Sponsor,
        novelId,
        showModalOnError,
    });

    const activeSubscription = useMemo(() => subscriptions?.find(subscription => subscription.active), [subscriptions]);

    return {
        data: subscriptions,
        activeSubscription,
        ...rest,
    };
}
