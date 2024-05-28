import type { GetPaymentMethodsResponse } from '@app/_proto/Protos/billing';
import { BillingClient } from '@app/_proto/Protos/billing.client';
import { PaymentMethodGateway, PaymentMethodItem, PaymentMethodType } from '@app/_proto/Protos/payments';
import { Empty } from '@app/_proto/google/protobuf/empty';
import { StringValue } from '@app/_proto/google/protobuf/wrappers';
import Checkbox from '@app/components/checkbox';
import PaymentsAddCard from '@app/components/payments/payments.add.card';
import PaymentsSelectionItems, { hasSufficientBalance } from '@app/components/payments/payments.selection.items';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useAuth } from '@app/libs/auth';
import { batch } from '@app/libs/utils';
import { CircularProgress } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import clsx from 'clsx';
import produce from 'immer';
import type * as React from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type PaymentSelectionMode = 'purchase' | 'subscription';

export type PaymentsSelectionProps = {
    onChange?: (paymentMethod: PaymentMethodItem | null) => void;
    mode: PaymentSelectionMode;
    price?: number;
    validPaymentTypes?: PaymentMethodType[];
    validPaymentGateways?: PaymentMethodGateway[];
};

type GroupedPaymentMethods = Record<PaymentMethodType, PaymentMethodItem[]>;

export const DefaultValidGateways = [PaymentMethodGateway.Stripe, PaymentMethodGateway.Braintree];
export const DefaultValidPaymentTypes = [PaymentMethodType.CardType, PaymentMethodType.PayPalType];

const noCard = PaymentMethodItem.create({
    id: StringValue.create({ value: 'CARD_EMPTY' }),
    type: PaymentMethodType.CardType,
    gateway: PaymentMethodGateway.Stripe,
    isDefault: true,
    label: 'Add new card',
});

const noPayPal = PaymentMethodItem.create({
    id: StringValue.create({ value: 'PAYPAL_EMPTY' }),
    type: PaymentMethodType.PayPalType,
    gateway: PaymentMethodGateway.Braintree,
    isDefault: false,
    label: 'PayPal',
});

const GroupedPaymentMethod = ({
    paymentMethods,
    value,
    price,
    onSelect,
}: {
    paymentMethods: PaymentMethodItem[];
    value: PaymentMethodItem | null;
    price?: number;
    onSelect: (paymentMethod: PaymentMethodItem) => void;
}) => {
    const [selected, setSelected] = useState<PaymentMethodItem | null>(paymentMethods[0]);

    /**
     * Necessary fix
     * When card was added through 'Add new card' button,
     * Subsequent clicks on the checkbox of newly added card kept opening the new card dialog.
     * So, we update the selected item when we have fresh data.
     */
    useEffect(() => {
        setSelected(prev =>
            paymentMethods.some(pm => StringValue.equals(pm.id, prev?.id)) ? prev : paymentMethods[0]
        );
    }, [paymentMethods]);

    const handleSelect = useCallback(
        (paymentMethod: PaymentMethodItem) => {
            setSelected(paymentMethod);
            onSelect?.(paymentMethod);
        },
        [onSelect]
    );

    const handleCheck = useCallback(() => {
        if (selected) {
            if (!hasSufficientBalance(selected, price)) {
                return;
            }

            onSelect?.(selected);
        }
    }, [onSelect, price, selected]);

    const isDisabled = !hasSufficientBalance(selected, price);

    return (
        <div
            className={clsx('grid grid-cols-[minmax(0,_406px)_22px] items-center gap-x-[12px]', {
                'pointer-events-none': isDisabled,
            })}
        >
            <PaymentsSelectionItems
                className="max-w-full flex-1 sm:max-w-[406px]"
                paymentMethods={paymentMethods}
                onSelectPayment={handleSelect}
                price={price}
            />
            <Checkbox
                onChange={handleCheck}
                disabled={isDisabled}
                checked={paymentMethods.some(pm => StringValue.equals(pm.id, value?.id))}
            />
        </div>
    );
};

export default function PaymentsSelection({
    price,
    validPaymentTypes,
    validPaymentGateways,
    onChange,
}: PaymentsSelectionProps) {
    const { user } = useAuth();

    const queryClient = useQueryClient();

    const [selectedPayment, setSelectedPayment] = useState<PaymentMethodItem | null>(null);

    const [addCardDialogOpen, setAddCardDialogOpen] = useState(false);

    const validTypes = useMemo(() => new Set([...(validPaymentTypes || [])]), [validPaymentTypes]);
    const validGateways = useMemo(() => new Set([...(validPaymentGateways || [])]), [validPaymentGateways]);

    const { data, status } = useGrpcApiWithQuery(
        BillingClient,
        c => c.getPaymentMethods,
        Empty.create(),
        ['payment-methods', user?.id],
        {
            staleTime: 0, //Data is always stale
            keepPreviousData: true,
            refetchOnMount: true,
            refetchOnWindowFocus: false,
        }
    );

    const items = useMemo(() => {
        const emptyMethods: PaymentMethodItem[] = [];

        if (data) {
            if (
                !data.items.some(it => it.gateway === PaymentMethodGateway.Stripe) &&
                validGateways.has(PaymentMethodGateway.Stripe)
            ) {
                emptyMethods.push(noCard);
            }

            if (
                !data.items.some(it => it.gateway === PaymentMethodGateway.Braintree) &&
                validGateways.has(PaymentMethodGateway.Braintree)
            ) {
                emptyMethods.push(noPayPal);
            }

            const items = [...emptyMethods, ...data.items];

            items.sort((a, b) => {
                const left = a.isDefault ? 1 : a.gateway === PaymentMethodGateway.Stripe ? 1 : -1;
                const right = b.isDefault ? 1 : b.gateway === PaymentMethodGateway.Stripe ? 1 : -1;

                return right - left;
            });

            return items;
        }

        return null;
    }, [data, validGateways]);

    useEffect(() => {
        if (items) {
            const [first] = items.filter(f => validTypes.has(f.type) && validGateways.has(f.gateway));

            //If selectedPayment is not set or the new payment methods returned does not contain the currently selected payment method
            if (!selectedPayment || !items.some(it => it.id === selectedPayment.id)) {
                setSelectedPayment(first);

                onChange?.(first);
            }
        }
    }, [items, onChange, selectedPayment, validGateways, validTypes]);

    const hasCard = useMemo(() => {
        if (!items) {
            return false;
        }

        return items.some(it => it.gateway === PaymentMethodGateway.Stripe);
    }, [items]);

    const groupedMethods = useMemo(() => {
        if (!items) {
            return [];
        }

        const initialData = {};

        if (!items.some(it => it.gateway === PaymentMethodGateway.Stripe)) {
            initialData[PaymentMethodType.CardType] = [noCard];
        }

        const grouped = items
            .filter(f => validGateways.has(f.gateway) && validTypes.has(f.type))
            .reduce<GroupedPaymentMethods>((prev, current) => {
                prev[current.type] ||= [];
                prev[current.type].push(current);

                return prev;
            }, initialData as any);

        return Object.entries(grouped);
    }, [items, validGateways, validTypes]);

    const handleSelect = useCallback(
        (paymentMethod: PaymentMethodItem) => {
            batch(() => {
                setSelectedPayment(paymentMethod);
                onChange?.(paymentMethod);
            });
        },
        [onChange]
    );

    const handleClickAddCard = useCallback((e: React.MouseEvent) => {
        e.preventDefault();

        setAddCardDialogOpen(true);
    }, []);

    const handleCardDialogClose = useCallback(() => setAddCardDialogOpen(false), []);

    const handleCardActionCompleted = useCallback(
        async (paymentMethod: PaymentMethodItem | null) => {
            setAddCardDialogOpen(false);

            if (paymentMethod) {
                queryClient.setQueryData(['payment-methods', user?.id], updater =>
                    produce(updater, (prev: GetPaymentMethodsResponse | null) => {
                        if (prev) {
                            prev.items.push(paymentMethod);
                        }
                    })
                );
            }
        },
        [queryClient, user?.id]
    );

    return (
        <div className="grid grid-flow-row gap-y-[12px]">
            <p className="text-[14px] leading-tight">Payment Methods</p>
            {status === 'loading' && <CircularProgress className="text-blue" />}
            {groupedMethods.map(([k, v]) => (
                <GroupedPaymentMethod
                    key={k}
                    paymentMethods={v}
                    value={selectedPayment}
                    onSelect={handleSelect}
                    price={price}
                />
            ))}
            {hasCard && (
                <div className="leading-none">
                    <a href="#" onClick={handleClickAddCard} className="cursor-pointer text-[14px] underline">
                        Add new card
                    </a>
                </div>
            )}
            <div className="leading-none">
                <span className="inline-block text-[12px] leading-tight">
                    {'Secure checkout experience provided by '}
                    {validGateways.has(PaymentMethodGateway.Braintree) ? 'Stripe or PayPal' : 'Stripe'}
                    {'. No payment method information is stored on Wuxiaworld.'}
                </span>
            </div>
            <PaymentsAddCard
                open={addCardDialogOpen}
                onClose={handleCardDialogClose}
                onCompleted={handleCardActionCompleted}
            />
        </div>
    );
}

PaymentsSelection.defaultProps = {
    validPaymentTypes: DefaultValidPaymentTypes,
    validPaymentGateways: DefaultValidGateways,
};
