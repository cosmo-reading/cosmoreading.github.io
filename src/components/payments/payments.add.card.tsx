import { GetPaymentMethodRequest } from '@app/_proto/Protos/billing';
import { BillingClient } from '@app/_proto/Protos/billing.client';
import { PaymentMethodGateway, type PaymentMethodItem } from '@app/_proto/Protos/payments';
import ButtonSpinner from '@app/components/button.spinner';
import QueryProgress from '@app/components/query.progress';
import type { ElementsCardFormRef } from '@app/components/stripe/elements.card';
import { useGrpcApiWithQuery } from '@app/libs/api';
import { useGrpcRequest } from '@app/libs/grpc';
import { batch } from '@app/libs/utils';
import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import * as React from 'react';
import { lazy, useCallback, useRef, useState } from 'react';

const StripePayments = lazy(() => import('@app/components/stripe'), {
    ssr: false,
});

export type PaymentsAddCardProps = {
    open: boolean;
    onClose: () => void;
    onCompleted: (paymentMethod: PaymentMethodItem | null) => void;
};

export default function PaymentsAddCard({ open, onClose, onCompleted }: PaymentsAddCardProps) {
    const [submitting, setSubmitting] = useState(false);
    const [newPaymentMethodId, setNewPaymentMethodId] = useState<string | undefined>();

    const paymentFormRef = useRef<ElementsCardFormRef>(null);

    //#region : Server request to fetch payment method
    const request = useGrpcRequest(GetPaymentMethodRequest, {
        paymentMethodId: newPaymentMethodId,
        paymentGateway: PaymentMethodGateway.Stripe,
    });

    const { status } = useGrpcApiWithQuery(
        BillingClient,
        c => c.getPaymentMethod,
        request,
        ['payment-method', newPaymentMethodId],
        {
            staleTime: Number.POSITIVE_INFINITY,
            cacheTime: 0, //Don't cache
            keepPreviousData: false,
            enabled: !!newPaymentMethodId,
            onSuccess(data) {
                batch(() => {
                    setNewPaymentMethodId(undefined);
                    setSubmitting(false);
                    onCompleted(data?.item ?? null);
                });
            },
            onError() {
                batch(() => {
                    setNewPaymentMethodId(undefined);
                    setSubmitting(false);
                });
            },
        }
    );
    //#endregion : Server request to fetch payment method

    const handleCardAddSubmit = useCallback(async () => {
        if (!paymentFormRef.current) {
            return;
        }

        setSubmitting(true);

        try {
            const addCardResponse = await paymentFormRef.current.submitForm(false);

            setNewPaymentMethodId(addCardResponse ?? undefined);
        } catch (e) {
            onCompleted(null);
        } finally {
            setSubmitting(false);
        }
    }, [onCompleted]);

    return (
        <>
            {status !== 'idle' ? (
                <div className="flex flex-col justify-center">
                    <QueryProgress status="loading" />
                </div>
            ) : (
                <Dialog
                    open={open}
                    fullWidth
                    PaperProps={{
                        className: 'dark:!bg-[#202020] max-w-[480px] h-[423.5px] h-full',
                    }}
                    css={theme => ({
                        '& .MuiDialog-paper': {
                            [theme.breakpoints.down(396)]: {
                                height: '438.5px !important',
                            },
                        },
                    })}
                >
                    <DialogTitle className="flex items-center justify-between pl-[20px] pb-[6px] pr-[11px]">
                        <span className="text-[18px] font-bold">Add Card Details</span>
                        <Close onClick={onClose} className="cursor-pointer text-[#777]" />
                    </DialogTitle>
                    <DialogContent className="flex flex-col px-[20px] pt-[20px] pb-0">
                        <StripePayments ref={paymentFormRef} />
                    </DialogContent>
                    <DialogActions className="px-[20px] pt-[4.5px]">
                        <Button
                            onClick={onClose}
                            variant="outlined"
                            color="secondary"
                            className="h-[36px] w-[94px] !text-[13px] !font-semibold"
                        >
                            Cancel
                        </Button>
                        <ButtonSpinner
                            onClick={handleCardAddSubmit}
                            color="primary"
                            spinner={submitting}
                            disabled={submitting}
                            className="h-[36px] w-[94px] !text-[13px] !font-semibold"
                        >
                            Add
                        </ButtonSpinner>
                    </DialogActions>
                </Dialog>
            )}
        </>
    );
}
