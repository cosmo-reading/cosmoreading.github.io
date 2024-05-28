import type { SponsorPlanItem } from '@app/_proto/Protos/sponsors';
import type { SubscriptionItem } from '@app/_proto/Protos/subscriptions';
import type { TierActionType } from '@app/domains/champion/types';
import { getOneofValue } from '@app/libs/grpc';
import { decimalToNumber } from '@app/libs/utils';

export const reducePlanActionType = (
    currentSubscription: SubscriptionItem | null,
    newPlan: SponsorPlanItem
): TierActionType => {
    const plan = getOneofValue(currentSubscription?.plan?.plan, 'sponsor');

    if (!currentSubscription?.active) {
        return 'subscribe';
    }

    const pendingPlan = getOneofValue(currentSubscription?.pendingPlan?.plan, 'sponsor');
    if (pendingPlan && pendingPlan.id === newPlan.id) {
        return 'unsubscribe';
    }

    if (!plan) {
        return 'subscribe';
    }

    const planPrice = decimalToNumber(plan.price);

    if (plan.id === newPlan.id) {
        if (currentSubscription.subscriptionEndedAt) {
            return 'reactivate';
        }
        if (!pendingPlan || planPrice <= decimalToNumber(pendingPlan?.price)) {
            return 'unsubscribe';
        }

        return 'reactivate';
    }

    return decimalToNumber(newPlan.price) > planPrice ? 'upgrade' : 'downgrade';
};
