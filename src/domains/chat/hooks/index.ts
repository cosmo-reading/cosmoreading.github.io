import useChampionSubscriptions from '@app/domains/champion/hooks/useChampionSubscriptions';
import { useAuth } from '@app/libs/auth';
import { useMemo } from 'react';

export function useChatInfo() {
    const { user } = useAuth();
    const { activeSubscription } = useChampionSubscriptions();

    const isVip = user?.isVipActive || false;
    const hasSubscription = !!activeSubscription;

    return useMemo(
        () => ({
            canUseChat: isVip || hasSubscription || (user?.permissions?.roles.length || []) > 0,
        }),
        [hasSubscription, isVip, user?.permissions?.roles.length]
    );
}
