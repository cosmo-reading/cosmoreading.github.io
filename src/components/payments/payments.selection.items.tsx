import { PaymentMethodGateway, type PaymentMethodItem, PaymentMethodType } from '@app/_proto/Protos/payments';
import { StringValue } from '@app/_proto/google/protobuf/wrappers';
import { ReactComponent as PayPalLogo } from '@app/assets/paypal.svg';
import { ReactComponent as StripeLogo } from '@app/assets/stripe.svg';
import { ReactComponent as WuxiaworldLogo } from '@app/assets/wu-black-old.svg';
import { decimalToNumber } from '@app/libs/utils';
import { formatAmountForDisplay } from '@app/utils/utils';
import { ListItemIcon, MenuItem, Select, type SelectChangeEvent } from '@mui/material';
import clsx from 'clsx';
import { useCallback, useEffect, useMemo, useState } from 'react';

export type PaymentsSelectionItem = JSX.IntrinsicElements['div'] & {
    paymentMethods: PaymentMethodItem[];
    price?: number;
    onSelectPayment?: (paymentMethod: PaymentMethodItem) => void;
};

const getPaymentLogo = (paymentMethod: PaymentMethodItem) => {
    switch (paymentMethod.gateway) {
        case PaymentMethodGateway.Stripe:
            return <StripeLogo height="27px" width="52px" className="mr-[4px] ml-[-6px]" />;
        case PaymentMethodGateway.Braintree:
            return <PayPalLogo height="20px" width="17px" className="mr-[10px]" />;
        case PaymentMethodGateway.Wuxiaworld:
            return <WuxiaworldLogo width="21px" height="24px" className="mr-[10px] fill-current" />;
    }

    return null;
};

export const hasSufficientBalance = (paymentMethod: PaymentMethodItem | null, price?: number) => {
    if (!paymentMethod?.balance || !price) {
        return true;
    }

    const balance = decimalToNumber(paymentMethod.balance);

    if (paymentMethod.type === PaymentMethodType.EbookVouchersType && balance > 0) {
        return true;
    }

    if (paymentMethod.balance && balance < price) {
        return false;
    }

    return true;
};

const formatBalance = (paymentMethod: PaymentMethodItem | null) => {
    if (!paymentMethod) {
        return 0;
    }

    if (paymentMethod.type === PaymentMethodType.EbookVouchersType) {
        return decimalToNumber(paymentMethod.balance);
    }

    return formatAmountForDisplay(paymentMethod.balance);
};

export default function PaymentsSelectionItems({
    paymentMethods,
    price,
    onSelectPayment,
    ...rest
}: PaymentsSelectionItem) {
    const sortedPaymentMethods = useMemo(() => {
        return [...paymentMethods].sort((a, b) => {
            const left = a.isDefault ? 1 : 0;
            const right = b.isDefault ? 1 : 0;

            return right - left;
        });
    }, [paymentMethods]);

    const [selected, setSelected] = useState<PaymentMethodItem | null>(sortedPaymentMethods[0]);

    /**
     * Necessary fix
     * When card was added through 'Add new card' button,
     * Subsequent clicks on the checkbox of newly added card kept opening the new card dialog.
     * So, we update the selected item when we have fresh data.
     */
    useEffect(() => {
        setSelected(prev =>
            sortedPaymentMethods.some(pm => StringValue.equals(pm.id, prev?.id)) ? prev : sortedPaymentMethods[0]
        );
    }, [paymentMethods, sortedPaymentMethods]);

    const handleChange = useCallback(
        (e: SelectChangeEvent<string>) => {
            const value = paymentMethods.find(f => f.id?.value === e.target.value) || null;

            setSelected(value);

            if (value) {
                onSelectPayment?.(value);
            }
        },
        [onSelectPayment, paymentMethods]
    );

    const isDisabled = !hasSufficientBalance(selected, price);

    const handleSelect = useCallback(() => {
        if (selected && !isDisabled) {
            onSelectPayment?.(selected);
        }
    }, [isDisabled, onSelectPayment, selected]);

    return (
        <div {...rest}>
            {sortedPaymentMethods.length === 1 ? (
                <div
                    className={clsx(
                        `flex h-[46px] w-[100%] max-w-full cursor-pointer items-center rounded-[6px] border border-solid border-[#dcdcdc] 
                        px-[16px] dark:border-[#5c5c5c] sm:max-w-[406px]`,
                        {
                            'bg-[#f4f4f4] dark:bg-[#2f2f2f]': isDisabled,
                            'overflow-x-auto whitespace-nowrap':
                                sortedPaymentMethods[0].type === PaymentMethodType.PayPalType,
                        }
                    )}
                    onClick={handleSelect}
                >
                    <ListItemIcon className="flex min-w-0 items-center">
                        {getPaymentLogo(sortedPaymentMethods[0])}
                    </ListItemIcon>
                    <span className="inline-block flex-1 align-middle text-[14px] first-letter:capitalize">
                        {sortedPaymentMethods[0].label}
                    </span>
                    {!!sortedPaymentMethods[0].balance && (
                        <span className="ml-[10px] text-[13px] text-[#888]">
                            You have <strong className="font-semibold">{formatBalance(selected)}</strong>
                        </span>
                    )}
                </div>
            ) : (
                <Select
                    className="h-[46px] w-[100%] max-w-full pl-[8px] text-[14px] dark:border-[#5c5c5c] dark:bg-transparent sm:max-w-[406px]"
                    classes={{
                        icon: 'dark:text-white',
                    }}
                    onChange={handleChange}
                    value={selected?.id?.value}
                    disabled={isDisabled}
                >
                    {sortedPaymentMethods.map(p => (
                        <MenuItem key={p.id?.value} value={p.id?.value}>
                            <span className="grid grid-cols-[auto_minmax(0,_1fr)] items-center">
                                {getPaymentLogo(p)}
                                <span className="overflow-hidden overflow-ellipsis align-middle text-[14px] first-letter:capitalize">
                                    {p.label}
                                </span>
                            </span>
                        </MenuItem>
                    ))}
                </Select>
            )}
        </div>
    );
}
