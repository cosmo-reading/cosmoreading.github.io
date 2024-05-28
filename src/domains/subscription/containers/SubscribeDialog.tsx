import type { GetPaymentMethodsResponse } from '@app/_proto/Protos/billing';
import { PaymentMethodGateway, PaymentMethodItem, PaymentMethodType } from '@app/_proto/Protos/payments';
import { SponsorPlanItem } from '@app/_proto/Protos/sponsors';
import {
    CancelSubscriptionRequest,
    CreateSubscriptionRequest,
    GetSubscriptionCostRequest,
    GetSubscriptionRequest,
    GetSubscriptionsRequest_Type,
    type SubscriptionItem,
    type SubscriptionItem_Plan,
    SubscriptionPlatform,
    SubscriptionType,
    UpdateSubscriptionRequest,
} from '@app/_proto/Protos/subscriptions';
import { SubscriptionsClient } from '@app/_proto/Protos/subscriptions.client';
import { VipItem, VipItem_VipType } from '@app/_proto/Protos/vips';
import { StringValue } from '@app/_proto/google/protobuf/wrappers';
import { logAnalyticsEvent } from '@app/analytics';
import PayPalPayments from '@app/components/braintree/paypal.payments';
import ButtonSpinner from '@app/components/button.spinner';
import Checkbox from '@app/components/checkbox';
import { useComponentClasses } from '@app/components/hooks';
import PaymentsAddCard from '@app/components/payments/payments.add.card';
import PaymentsFailedDialog from '@app/components/payments/payments.failed.dialog';
import PaymentsSelection, { DefaultValidGateways } from '@app/components/payments/payments.selection';
import type { SubscriptionSelectionType } from '@app/components/subscriptions/subscriptions.button';
import SubscriptionsRefundPolicy from '@app/components/subscriptions/subscriptions.refund.policy';
import SubscriptionsSuccess from '@app/components/subscriptions/subscriptions.success';
import withProtectedRedirect from '@app/domains/common/containers/WithProtectedRedirect';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useAuth } from '@app/libs/auth';
import { GrpcError, useGrpcRequest } from '@app/libs/grpc';
import { useHttp } from '@app/libs/http';
import { batch, decimalToNumber, numberToDecimal } from '@app/libs/utils';
import { getStripe } from '@app/utils/stripe';
import { formatAmountForDisplay } from '@app/utils/utils';
import { Close } from '@mui/icons-material';
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Divider } from '@mui/material';
import type { PartialMessage } from '@protobuf-ts/runtime';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import { backOff } from 'exponential-backoff';
import produce from 'immer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
    opened: boolean;
    onClose: () => void;
    cancelOpened: boolean;
    onCancelClose: () => void;
    plan: SubscriptionPlan;
    mode: 'confirm' | 'subscribe';
    onSubscribe?: (subscription: SubscriptionItem, paymentMethod?: PaymentMethodItem) => void;
    onProcessingStateChange?: (processing: boolean) => void;
    subscription?: SubscriptionItem | null;
    selectedPaymentMethod?: PaymentMethodItem | null;
};

function SubscribeDialog({
    opened,
    onClose,
    cancelOpened,
    onCancelClose,
    plan,
    subscription: currentSubscription,
    // mode,
    selectedPaymentMethod,
    onSubscribe,
    onProcessingStateChange,
}: Props) {
    const queryClient = useQueryClient();
    // const location = useLocation();
    // const params = useParams();
    const { user, refreshUser } = useAuth();
    const { grpcRequest } = useHttp();

    const { MuiButton: buttonClasses } = useComponentClasses('MuiButton');

    const [error, setError] = useState<string | null>(null);
    const [showError, setShowError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodItem | null>(selectedPaymentMethod || null);
    const [subscription, setSubscription] = useState<SubscriptionItem | null>(currentSubscription || null);
    const [needsPayPal, setNeedsPayPal] = useState(false);
    const [needsAddCard, setNeedsAddCard] = useState(false);
    const [acknowledge, setAcknowledge] = useState(false);
    const [waitingForActivation, setWaitingForActivation] = useState(false);
    const [refundPolicyOpen, setRefundPolicyOpen] = useState(false);
    // const subscriptionPlan = getCurrentPlan(subscription);
    const selectionType = getSelectionType(subscription || null, plan);

    const costRequest = useGrpcRequest(GetSubscriptionCostRequest, {
        plan: VipItem.is(plan)
            ? {
                  oneofKind: 'vipPlanId',
                  vipPlanId: plan.id,
              }
            : SponsorPlanItem.is(plan)
              ? {
                      oneofKind: 'sponsorPlan',
                      sponsorPlan: {
                          planId: plan?.id,
                          novelId: plan?.novelInfo?.id!,
                      },
                  }
              : undefined,
        paymentGateway: paymentMethod?.gateway ?? selectedPaymentMethod?.gateway,
        isUpgrade: subscription?.active ?? false,
    });

    const { data: costData } = useGrpcApiWithQuery(
        SubscriptionsClient,
        c => c.getSubscriptionCost,
        costRequest,
        ['sponsor-subscription-cost', plan.id],
        {
            cacheTime: 0,
            staleTime: 0,
            refetchOnWindowFocus: false,
            enabled: opened && !!paymentMethod,
        }
    );

    const handleError = useCallback((error?: string | null) => {
        batch(() => {
            setError(error ? error : null);
            setShowError(!!error);
            setLoading(false);
        });
    }, []);

    const handleSubscriptionActivated = useCallback(
        (subscription: SubscriptionItem, paymentMethod?: PaymentMethodItem) => {
            batch(() => {
                setWaitingForActivation(false);
                setLoading(false);
                setSubscription(subscription);
            });

            switch (subscription.type) {
                case SubscriptionType.SponsorSubscription:
                    queryClient.invalidateQueries(['subscriptions', GetSubscriptionsRequest_Type.Sponsor]);
                    queryClient.invalidateQueries(['advance-chapters']);
                    queryClient.invalidateQueries(['payment-methods']);

                    break;
                case SubscriptionType.VipSubscription:
                    queryClient.invalidateQueries(['subscriptions', GetSubscriptionsRequest_Type.Vip]);

                    refreshUser();
                    break;
            }

            onProcessingStateChange?.(false);
            onSubscribe?.(subscription, paymentMethod);
            onClose();
        },
        [onClose, onProcessingStateChange, onSubscribe, queryClient, refreshUser]
    );

    const checkSubscriptionActivated = useCallback(
        (subscription: SubscriptionItem) => {
            const waitForActivation = async () => {
                const request = GetSubscriptionRequest.create({
                    id: subscription?.id,
                    type:
                        subscription?.plan?.plan.oneofKind === 'sponsor'
                            ? SubscriptionType.SponsorSubscription
                            : subscription?.plan?.plan.oneofKind === 'vip'
                              ? SubscriptionType.VipSubscription
                              : undefined,
                });

                const subscriptionData = await grpcRequest(SubscriptionsClient, c => c.getSubscription, request);

                const pendingPlan = getPlan(subscriptionData?.item?.pendingPlan);

                if (subscriptionData?.item && subscriptionData.item.active && !pendingPlan) {
                    handleSubscriptionActivated(subscriptionData.item, paymentMethod ?? undefined);
                } else {
                    throw new Error('activation failed');
                }
            };
            backOff(waitForActivation, {
                delayFirstAttempt: false,
                startingDelay: 1000 * 5,
                numOfAttempts: 5,
            });
        },
        [grpcRequest, handleSubscriptionActivated, paymentMethod]
    );

    const doSubscribe = useCallback(
        async (paymentMethod?: PaymentMethodItem) => {
            setLoading(true);

            if (paymentMethod?.id?.value === 'PAYPAL_EMPTY') {
                setNeedsPayPal(true);

                return;
            }

            if (paymentMethod?.id?.value === 'CARD_EMPTY') {
                setNeedsAddCard(true);

                return;
            }

            let cost = costData;

            if (!cost) {
                cost = await grpcRequest(SubscriptionsClient, c => c.getSubscriptionCost, costRequest);
            }

            const commonRequest: PartialMessage<CreateSubscriptionRequest | UpdateSubscriptionRequest> = {
                confirmPrice: cost?.total ?? plan.price ?? numberToDecimal(0)!,
                paymentGateway: paymentMethod?.gateway ?? subscription?.paymentGateway,
                paymentMethod: {
                    oneofKind: 'paymentMethodId',
                    paymentMethodId: paymentMethod?.id!,
                },
                platform: SubscriptionPlatform.WebSubscription,
                plan: VipItem.is(plan)
                    ? {
                          oneofKind: 'vipPlanId',
                          vipPlanId: plan.id,
                      }
                    : SponsorPlanItem.is(plan)
                      ? {
                              oneofKind: 'sponsorPlanId',
                              sponsorPlanId: plan.id,
                          }
                      : undefined,
            };

            const request = subscription?.active
                ? UpdateSubscriptionRequest.create({
                      ...commonRequest,
                      id: subscription?.id,
                  })
                : CreateSubscriptionRequest.create(commonRequest);

            try {
                const executeRequest = () =>
                    CreateSubscriptionRequest.is(request)
                        ? grpcRequest(SubscriptionsClient, c => c.createSubscription, request)
                        : grpcRequest(SubscriptionsClient, c => c.updateSubscription, request);

                const { result, confirmToken, ...response } = await executeRequest();

                if (paymentMethod?.gateway === PaymentMethodGateway.Stripe && confirmToken?.value) {
                    const stripe = await getStripe();

                    const stripeResult = await stripe!.confirmCardPayment(confirmToken.value, {
                        payment_method: paymentMethod?.id?.value!,
                    });

                    if (stripeResult.error) {
                        handleError(stripeResult.error.message);
                    } else if (stripeResult.paymentIntent?.status === 'succeeded') {
                        batch(() => {
                            setSubscription(response.item || null);
                            setWaitingForActivation(true);
                            setLoading(false);
                        });

                        if (response.item) {
                            checkSubscriptionActivated(response.item);
                        }
                    }
                } else if (result) {
                    batch(() => {
                        if (response.item) {
                            setSubscription(response.item);

                            if (response.isPending) {
                                setWaitingForActivation(true);
                                checkSubscriptionActivated(response.item);
                            }
                        }
                    });

                    if (!response.isPending && response.item) {
                        handleSubscriptionActivated(response.item, paymentMethod);
                    }

                    if (BUYING_SUBSCRIPTION_TYPES.includes(selectionType)) {
                        const itemPlanInfo = response.item?.plan?.plan || null;
                        if (itemPlanInfo?.oneofKind === 'vip' && itemPlanInfo.vip) {
                            logAnalyticsEvent('Buy VIP Subscription', {
                                'Action Type': selectionType.toUpperCase(),
                                Price: decimalToNumber(request.confirmPrice).toFixed(2),
                                'VIP ID': itemPlanInfo.vip.planId,
                                'VIP Interval': itemPlanInfo.vip.interval,
                                'VIP Type': VipItem_VipType[itemPlanInfo.vip.type],
                                'VIP Product ID': null,
                                'Payment Method': PaymentMethodType[paymentMethod?.type || -1] || null,
                            });
                        }
                    }
                }
            } catch (error) {
                if (error instanceof GrpcError) {
                    handleError(error?.response?.description);
                }
            }
        },
        [
            plan,
            costData,
            subscription?.paymentGateway,
            subscription?.active,
            subscription?.id,
            grpcRequest,
            costRequest,
            handleError,
            selectionType,
            handleSubscriptionActivated,
            checkSubscriptionActivated,
        ]
    );

    const handleUnsubscribe = useCallback(async () => {
        if (!subscription) {
            return;
        }

        setLoading(true);

        const request = CancelSubscriptionRequest.create({
            id: subscription.id,
            type: subscription.type,
            reason: StringValue.create({
                value: 'User requested',
            }),
        });

        try {
            await grpcRequest(SubscriptionsClient, c => c.cancelSubscription, request);

            switch (subscription.type) {
                case SubscriptionType.SponsorSubscription:
                    queryClient.invalidateQueries(['subscriptions', GetSubscriptionsRequest_Type.Sponsor]);
                    break;
                case SubscriptionType.VipSubscription:
                    queryClient.invalidateQueries(['subscriptions', GetSubscriptionsRequest_Type.Vip]);

                    refreshUser();
                    break;
            }
        } finally {
            batch(() => {
                setLoading(false);
                onCancelClose();
            });
        }
    }, [grpcRequest, onCancelClose, queryClient, refreshUser, subscription]);

    const buttonText = useMemo(() => {
        switch (selectionType) {
            case 'subscribe':
                return 'SUBSCRIBE';
            case 'upgrade':
                return 'UPGRADE';
            case 'downgrade':
                return 'DOWNGRADE';
            case 'reactivate':
                return 'REACTIVATE';
            case 'unsubscribe':
                return 'UNSUBSCRIBE';
            default:
                return 'SUBSCRIBE';
        }
    }, [selectionType]);

    const dialogButtonText = useMemo(() => {
        if (buttonText === 'SUBSCRIBE') {
            return 'Yes';
        }
        if (buttonText === 'UNSUBSCRIBE') {
            return 'Update';
        }

        return buttonText;
    }, [buttonText]);

    const handleSelectPayPal = useCallback(
        (paymentMethod: PaymentMethodItem | string) => {
            if (!PaymentMethodItem.is(paymentMethod)) {
                setLoading(false);
                setNeedsPayPal(false);

                return;
            }

            setNeedsPayPal(false);

            doSubscribe(paymentMethod);
        },
        [doSubscribe]
    );

    const handleErrorPayPal = useCallback(
        (errorMessage: string) => {
            batch(() => {
                setLoading(false);
                setNeedsPayPal(false);
                handleError(errorMessage);
            });
        },
        [handleError]
    );

    const handleAddCardActionCompleted = useCallback(
        async (paymentMethod: PaymentMethodItem | null) => {
            if (!loading || !paymentMethod) {
                setLoading(false);
                setNeedsAddCard(false);

                return;
            }

            queryClient.setQueryData(['payment-methods', user?.id], updater =>
                produce(updater, (prev: GetPaymentMethodsResponse | null) => {
                    if (prev && PaymentMethodItem.is(paymentMethod)) {
                        prev.items.push(paymentMethod);
                    }
                })
            );

            setNeedsAddCard(false);
            doSubscribe(paymentMethod);
        },
        [doSubscribe, loading, queryClient, user?.id]
    );

    const handleCloseAddCard = useCallback(() => {
        setLoading(false);
        setNeedsAddCard(false);
    }, []);

    // const logClickVipSubscribe = useCallback((plan: VipItem) => {
    //     logAnalyticsEvent('Click VIP Subscribe', {
    //         Price: decimalToNumber(plan.price).toFixed(2),
    //         'VIP ID': plan.planId,
    //         'VIP Interval': plan.interval,
    //         'VIP Type': VipItem_VipType[plan.type],
    //         'VIP Product ID': plan.product?.id || null,
    //     });
    // }, []);

    const handlePaymentChange = useCallback((paymentMethod: PaymentMethodItem | null) => {
        setPaymentMethod(paymentMethod);
    }, []);

    const handleConfirm = useCallback(() => {
        if (!paymentMethod) {
            return;
        }

        doSubscribe(paymentMethod);
    }, [doSubscribe, paymentMethod]);

    const handleOpenRefundPolicy = useCallback(() => setRefundPolicyOpen(true), []);
    const handleCloseRefundPolicy = useCallback(() => setRefundPolicyOpen(false), []);

    useEffect(() => {
        setSubscription(currentSubscription || null);
    }, [currentSubscription]);

    useEffect(() => {
        onProcessingStateChange?.(loading);
    }, [loading, onProcessingStateChange]);

    return (
        <>
            <Dialog
                fullWidth
                open={opened}
                onClose={onClose}
                PaperProps={{
                    className: 'dark:!bg-[#202020]',
                    style: {
                        maxWidth: '480px',
                    },
                }}
            >
                <DialogTitle className="flex items-center justify-between pt-[16px] pb-[10px] pl-[20px] pr-[16px] sm:py-[20px]">
                    <span className="text-[16px] font-bold sm:text-[21px]">Confirm</span>
                    <Close onClick={onClose} className="cursor-pointer text-[#777]" />
                </DialogTitle>
                <DialogContent
                    className={clsx('p-[20px]', {
                        'pointer-events-none': loading,
                    })}
                >
                    <div className="mb-[10px] flex max-w-[100%] flex-col space-y-[16px]">
                        <div>
                            <p className="text-[14px] leading-[1.5] text-[#666] dark:text-[#BDBDBD]">
                                You have selected the plan <span className="font-bold">{plan.name}</span>.
                            </p>
                            <p className="text-[14px] leading-[1.5] text-[#666] dark:text-[#BDBDBD]">
                                {getSubscriptionText(currentSubscription, plan)}
                            </p>
                        </div>
                        <div className="flex items-center">
                            <Checkbox
                                variant="circle"
                                onChange={() => setAcknowledge(prev => !prev)}
                                checked={acknowledge}
                            />
                            <span className="ml-[8px] text-[14px] text-[#666] dark:text-[#BDBDBD]">
                                I acknowledge that I have read and accept the{' '}
                                <span className="cursor-pointer underline" onClick={handleOpenRefundPolicy}>
                                    refund policy
                                </span>
                            </span>
                        </div>
                        <Divider />
                        {costData || !paymentMethod ? (
                            <div>
                                {SponsorPlanItem.is(plan) && selectionType !== 'upgrade' && (
                                    <div className="text-[12px] leading-tight text-[#888888]">
                                        {plan.novelInfo?.name}
                                    </div>
                                )}
                                <div className="flex flex-col space-y-[16px] leading-tight">
                                    {costData?.lineItems?.map((lineItem, idx) => (
                                        <div
                                            className="flex flex-1 items-center justify-between space-x-[20px]"
                                            key={idx}
                                        >
                                            <p className="text-[14px]">{lineItem.description?.value}</p>
                                            <p className="whitespace-nowrap text-[14px]">
                                                {formatAmountForDisplay(lineItem.amount)}
                                            </p>
                                        </div>
                                    ))}
                                    <div className="flex flex-1 items-center justify-between space-x-[20px]">
                                        <p className="text-[14px] font-semibold">Total</p>
                                        <p className="whitespace-nowrap text-[18px] font-semibold">
                                            {formatAmountForDisplay(costData?.total ?? plan.price)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-center">
                                <CircularProgress className="text-blue" />
                            </div>
                        )}
                        <Divider />
                        <div>
                            <PaymentsSelection
                                mode="subscription"
                                onChange={handlePaymentChange}
                                validPaymentGateways={
                                    selectionType === 'unsubscribe'
                                        ? DefaultValidGateways.filter(
                                              gateway => gateway !== PaymentMethodGateway.Braintree
                                          )
                                        : DefaultValidGateways
                                }
                            />
                        </div>
                    </div>
                </DialogContent>
                <DialogActions className="!space-x-[10px] px-[20px] pb-[20px] pt-0">
                    <Button
                        classes={{
                            ...buttonClasses,
                            root: twMerge(buttonClasses.root, '!text-[13px] font-semibold'),
                        }}
                        className="min-w-[94px]"
                        variant="outlined"
                        color="secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                    <ButtonSpinner
                        classes={{
                            ...buttonClasses,
                            root: twMerge(buttonClasses.root, '!text-[13px] font-semibold'),
                        }}
                        className="min-w-[94px]"
                        onClick={handleConfirm}
                        spinner={loading}
                        disabled={!paymentMethod || loading || !acknowledge || !costData}
                    >
                        {dialogButtonText}
                    </ButtonSpinner>
                </DialogActions>
            </Dialog>
            <Dialog
                open={cancelOpened}
                onClose={onCancelClose}
                PaperProps={{
                    className: 'dark:!bg-[#202020]',
                    style: {
                        maxWidth: '480px',
                    },
                }}
            >
                <DialogTitle className="flex items-center justify-between pt-[16px] pb-[10px] pl-[20px] pr-[16px] sm:py-[20px]">
                    <span className="text-[16px] font-bold sm:text-[21px]">Confirm</span>
                    <Close onClick={onCancelClose} className="cursor-pointer text-[#777]" />
                </DialogTitle>
                <DialogContent>
                    <div className="text-[14px] leading-[1.5] text-[#666] dark:text-[#BDBDBD]">
                        <p>Are you sure you want to unsubscribe?</p>
                        <p>Your subscription will be cancelled at the end of the current billing cycle.</p>
                    </div>
                </DialogContent>
                <DialogActions className="!space-x-[10px] px-[20px] pb-[20px] pt-0">
                    <Button
                        classes={{
                            ...buttonClasses,
                            root: twMerge(buttonClasses.root, '!text-[13px] font-semibold'),
                        }}
                        className="min-w-[94px]"
                        variant="outlined"
                        color="secondary"
                        onClick={onCancelClose}
                    >
                        Cancel
                    </Button>
                    <ButtonSpinner
                        classes={{
                            ...buttonClasses,
                            root: twMerge(buttonClasses.root, '!text-[13px] font-semibold'),
                        }}
                        className="min-w-[119px]"
                        onClick={handleUnsubscribe}
                        spinner={loading}
                        disabled={loading}
                    >
                        Unsubscribe
                    </ButtonSpinner>
                </DialogActions>
            </Dialog>
            <SubscriptionsRefundPolicy open={refundPolicyOpen} onClose={handleCloseRefundPolicy} />
            <PayPalPayments
                enabled={needsPayPal}
                mode="vault"
                onSelect={handleSelectPayPal}
                onError={handleErrorPayPal}
            />
            <PaymentsAddCard
                open={needsAddCard}
                onClose={handleCloseAddCard}
                onCompleted={handleAddCardActionCompleted}
            />
            {waitingForActivation && <SubscriptionsSuccess />}
            <PaymentsFailedDialog open={showError} error={error} onDismiss={() => handleError(null)} />
        </>
    );
}

type SubscriptionPlan = VipItem | SponsorPlanItem;

function getSelectionType(
    currentSubscription: SubscriptionItem | null,
    newPlan: SubscriptionPlan
): SubscriptionSelectionType {
    const plan = getCurrentPlan(currentSubscription);

    if (!currentSubscription?.active) {
        return 'subscribe';
    }

    const pendingPlan =
        currentSubscription?.pendingPlan?.plan.oneofKind === 'sponsor'
            ? currentSubscription.pendingPlan.plan.sponsor
            : currentSubscription.pendingPlan?.plan.oneofKind === 'vip'
              ? currentSubscription.pendingPlan.plan.vip
              : null;

    if (pendingPlan && pendingPlan?.id === newPlan.id) {
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

    if (
        currentSubscription.plan?.plan.oneofKind === 'vip' &&
        VipItem.is(plan) &&
        VipItem.is(newPlan) &&
        plan.type != newPlan.type
    ) {
        return newPlan.type > plan.type ? 'upgrade' : 'downgrade';
    }

    return decimalToNumber(newPlan.price) > planPrice ? 'upgrade' : 'downgrade';
}

const getCurrentPlan = (subscription: SubscriptionItem | null | undefined): SubscriptionPlan | null => {
    return subscription?.active
        ? subscription?.plan?.plan.oneofKind === 'vip'
            ? subscription.plan.plan.vip
            : subscription?.plan?.plan.oneofKind === 'sponsor'
              ? subscription.plan.plan.sponsor
              : null
        : null;
};

const getPlan = (subscriptionPlan: SubscriptionItem_Plan | null | undefined): VipItem | SponsorPlanItem | null => {
    return subscriptionPlan?.plan.oneofKind === 'vip'
        ? subscriptionPlan.plan.vip
        : subscriptionPlan?.plan.oneofKind === 'sponsor'
          ? subscriptionPlan.plan.sponsor
          : null;
};

const getSubscriptionText = (subscription: SubscriptionItem | null | undefined, plan: SubscriptionPlan) => {
    const currentPlan = getCurrentPlan(subscription);

    if (subscription?.active && plan.id === currentPlan?.id) {
        return `Charges for switching to a different plan will be prorated accordingly.
${!VipItem.is(plan) ? ' If you have any site credits, they will be applied to your order.' : ''}`;
    }

    if (subscription?.active) {
        return 'Switching to a different plan will be prorated accordingly.';
    }

    if (VipItem.is(plan)) {
        return `You will be charged ${formatAmountForDisplay(plan.price)} USD every ${
            plan.interval !== 12 ? `${plan.interval} month(s)` : 'year'
        } until cancellation.`;
    }

    return `You will be charged ${formatAmountForDisplay(plan.price)} USD monthly until cancellation.`;
};

// const getEventLocation = ({
//     pathname,
//     params,
// }: {
//     pathname: string;
//     params: ReturnType<typeof useParams>;
// }): string | null => {
//     if (pathname.startsWith('/novel') && params.hasOwnProperty('novelSlug')) {
//         if (params.hasOwnProperty('chapterSlug')) return 'Chapter Viewer';
//     }
//     return null;
// };

const BUYING_SUBSCRIPTION_TYPES = ['subscribe', 'upgrade', 'reactivate'];

export default withProtectedRedirect<Props>(SubscribeDialog, { showLoading: false });
