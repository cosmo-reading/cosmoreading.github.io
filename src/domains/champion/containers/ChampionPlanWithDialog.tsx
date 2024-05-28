import { PaymentMethodType } from '@app/_proto/Protos/payments';
import type { SponsorPlanItem } from '@app/_proto/Protos/sponsors';
import type { SubscriptionItem } from '@app/_proto/Protos/subscriptions';
import { amplitudeHandler } from '@app/analytics/handlers';
import { ChampionEvents } from '@app/domains/champion/analytics/amplitude/events';
import { championCommonLoggingParamsParser } from '@app/domains/champion/analytics/amplitude/handlers';
import ChampionPlan from '@app/domains/champion/components/ChampionPlan';
import type { TierActionType } from '@app/domains/champion/types';
import { reducePlanActionType } from '@app/domains/champion/utils/reducePlanActionType';
import { PAYMENT_METHOD_TYPE_READABLE } from '@app/domains/subscription/constants';
import SubscribeDialog from '@app/domains/subscription/containers/SubscribeDialog';
import { decimalToNumber } from '@app/libs/utils';
import { type MouseEvent, useRef, useState } from 'react';

type Props = {
    plan: SponsorPlanItem;
    currentSubscription: SubscriptionItem | null;
    onSelectPlan?: (plan: SponsorPlanItem) => void;
    handleProcessingStateChange?: (processingState: boolean) => void;
};

export default function ChampionPlanWithDialog({
    plan,
    currentSubscription,
    onSelectPlan,
    handleProcessingStateChange,
}: Props) {
    const [dialogOpened, setDialogOpened] = useState(false);
    const [cancelDialogOpened, setCancelDialogOpened] = useState(false);

    const planRef = useRef<HTMLDivElement>(null);

    const handleTierAction = (action: TierActionType) => {
        if (action === 'unsubscribe') {
            setCancelDialogOpened(true);
        } else {
            setDialogOpened(true);
        }
    };

    const handleChangePaymentMethod = (e: MouseEvent) => {
        e.preventDefault();
        setDialogOpened(true);
    };

    const shouldRenderSubscribeDialog = dialogOpened || cancelDialogOpened;

    return (
        <>
            <ChampionPlan
                actionType={reducePlanActionType(currentSubscription, plan)}
                name={plan.name}
                htmlDesc={plan?.description?.value}
                advChapterCount={plan.advanceChapterCount}
                price={decimalToNumber(plan.price)}
                onAction={handleTierAction}
                onChangePaymentMethod={handleChangePaymentMethod}
                data-amplitude-params={JSON.stringify({
                    ...championCommonLoggingParamsParser(plan),
                    actionType: reducePlanActionType(currentSubscription, plan),
                })}
                ref={planRef}
            />
            {shouldRenderSubscribeDialog && (
                <SubscribeDialog
                    opened={dialogOpened}
                    onClose={() => setDialogOpened(false)}
                    cancelOpened={cancelDialogOpened}
                    onCancelClose={() => setCancelDialogOpened(false)}
                    mode="confirm"
                    plan={plan}
                    subscription={currentSubscription}
                    onSubscribe={(champion, paymentMethod) => {
                        planRef.current?.setAttribute(
                            'data-amplitude-params',
                            JSON.stringify({
                                ...championCommonLoggingParamsParser(plan),
                                actionType: reducePlanActionType(currentSubscription, plan),
                                paymentMethod:
                                    PAYMENT_METHOD_TYPE_READABLE[paymentMethod?.type || PaymentMethodType.UnknownType],
                            })
                        );

                        amplitudeHandler(ChampionEvents.BuyChampionSubscribe, planRef.current as HTMLElement);
                        onSelectPlan?.(plan);
                    }}
                    onProcessingStateChange={handleProcessingStateChange}
                />
            )}
        </>
    );
}
