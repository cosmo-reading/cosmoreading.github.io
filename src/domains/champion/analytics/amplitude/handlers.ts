import type { NovelItem } from '@app/_proto/Protos/novels';
import { PaymentMethodType } from '@app/_proto/Protos/payments';
import type { SponsorPlanItem } from '@app/_proto/Protos/sponsors';
import type { SubscriptionItem } from '@app/_proto/Protos/subscriptions';
import { logAnalyticsEvent } from '@app/analytics';
import { extractAmplitudeParams } from '@app/analytics/utils';
import { CHAMPION_EVENT_NAMES, ChampionEvents } from '@app/domains/champion/analytics/amplitude/events';
import { reducePlanActionType } from '@app/domains/champion/utils/reducePlanActionType';
import {
    NovelLogNames,
    novelCommonLoggingParamsAdapter,
    novelCommonLoggingParamsParser,
} from '@app/domains/novel/analytics/amplitude/handlers';
import { PAYMENT_METHOD_TYPE_READABLE } from '@app/domains/subscription/constants';
import { decimalToNumber } from '@app/libs/utils';
import { pick } from 'lodash-es';

enum LogNames {
    PlanId = 'Champion Id',
    PlanName = 'Champion Name',
    PlanPrice = 'Price',
    AdvChapterCount = 'Advance Chapter Count',
    ActionType = 'Action Type',
    PaymentMethod = 'Payment Method',
}

export const championAmplitudeHandler = (event: ChampionEvents, el: HTMLElement | undefined) => {
    const { on, actionType, paymentMethod, ...params }: any = extractAmplitudeParams({ el });
    switch (event) {
        case ChampionEvents.ClickChampionSubscribe:
            return logAnalyticsEvent(CHAMPION_EVENT_NAMES[event], {
                On: on,
                ...pick(novelCommonLoggingParamsAdapter(params), [NovelLogNames.SeriesId, NovelLogNames.SeriesTitle]),
                ...championCommonLoggingParamsAdapter(params),
            });
        case ChampionEvents.BuyChampionSubscribe:
            return logAnalyticsEvent(CHAMPION_EVENT_NAMES[event], {
                On: on,
                ...pick(novelCommonLoggingParamsAdapter(params), [NovelLogNames.SeriesId, NovelLogNames.SeriesTitle]),
                ...championCommonLoggingParamsAdapter(params),
                [LogNames.ActionType]: actionType,
                [LogNames.PaymentMethod]: paymentMethod,
            });
        default:
            throw new Error('Not Implemented');
    }
};

export const championAnalyticsFactory = (event: ChampionEvents): any => {
    switch (event) {
        case ChampionEvents.ClickChampionSubscribe:
            return ({ on, novel, plan }: { on: string; novel: NovelItem; plan: SponsorPlanItem }) => {
                logAnalyticsEvent(CHAMPION_EVENT_NAMES[event], {
                    On: on,
                    ...novelCommonLoggingParamsAdapter(novelCommonLoggingParamsParser(novel)),
                    ...championCommonLoggingParamsAdapter(championCommonLoggingParamsParser(plan)),
                });
            };
        case ChampionEvents.BuyChampionSubscribe:
            return ({
                on,
                novel,
                subscription,
                plan,
                paymentMethod,
            }: {
                on: string;
                novel: NovelItem;
                subscription: SubscriptionItem;
                plan: SponsorPlanItem;
                actionType: string;
                paymentMethod;
            }) => {
                logAnalyticsEvent(CHAMPION_EVENT_NAMES[event], {
                    On: on,
                    ...novelCommonLoggingParamsAdapter(novelCommonLoggingParamsParser(novel)),
                    ...championCommonLoggingParamsAdapter(championCommonLoggingParamsParser(plan)),
                    [LogNames.ActionType]: reducePlanActionType(subscription, plan),
                    [LogNames.PaymentMethod]:
                        PAYMENT_METHOD_TYPE_READABLE[paymentMethod?.type || PaymentMethodType.UnknownType],
                });
            };
        default:
            throw new Error('Not Implemented');
    }
};

// note: can be exposed by user
export const championCommonLoggingParamsParser = (plan: SponsorPlanItem | undefined) => {
    return {
        planId: plan?.planId,
        planName: plan?.name,
        planPrice: decimalToNumber(plan?.price).toFixed(2),
        advChapterCount: plan?.advanceChapterCount,
    };
};

type ChampionCommonLoggingParamsAdapterParam = {
    planId?: SponsorPlanItem['planId'];
    planName?: SponsorPlanItem['name'];
    planPrice?: string;
    advChapterCount?: SponsorPlanItem['advanceChapterCount'];
};

const championCommonLoggingParamsAdapter = (params: ChampionCommonLoggingParamsAdapterParam) => {
    const { planId, planName, planPrice, advChapterCount } = params;
    return {
        [LogNames.PlanId]: planId,
        [LogNames.PlanName]: planName,
        [LogNames.PlanPrice]: planPrice,
        [LogNames.AdvChapterCount]: advChapterCount,
    };
};
