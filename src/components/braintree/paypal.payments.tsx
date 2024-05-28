import {
    AddPaymentMethodRequest,
    GetGatewayTokenRequest,
    GetGatewayTokenRequest_GatewayTokenType,
} from '@app/_proto/Protos/billing';
import { BillingClient } from '@app/_proto/Protos/billing.client';
import { PaymentMethodGateway, type PaymentMethodItem } from '@app/_proto/Protos/payments';
import Script from '@app/components/script';
import { useHttp } from '@app/libs/http';
import { useEventCallback } from '@app/libs/utils';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

export type BraintreePaymentsProps = {
    enabled?: boolean;
    mode: 'once' | 'vault';
    amount?: number;
    onSelect: (paymentMethodOrToken: PaymentMethodItem | string) => void;
    onError?: (errorMessage: string) => void;
};

export type BraintreePaymentsRef = {
    startCheckout: () => void;
};

export default function PayPalPayments({ enabled, mode, amount, onSelect, onError }: BraintreePaymentsProps) {
    const { grpcRequest } = useHttp();

    const [ready, setReady] = useState(false);

    const handleSelect = useEventCallback(onSelect);
    const handleError = useEventCallback(onError!);

    const handleLoad = useCallback(() => {
        setReady(true);
    }, []);

    useEffect(() => {
        let checkout;

        const teardown = () => {
            checkout?.teardown(() => {
                checkout = null;
            });
        };

        const startCheckout = async () => {
            const response = await grpcRequest(
                BillingClient,
                c => c.getGatewayToken,
                GetGatewayTokenRequest.create({
                    gateway: PaymentMethodGateway.Braintree,
                    tokenType: GetGatewayTokenRequest_GatewayTokenType.AddPaymentMethod,
                })
            );

            if (response.result && response.token?.value) {
                const bt = braintree as any;

                const token = response.token.value;

                bt.setup(token, 'custom', {
                    dataCollector: true,
                    onReady: integration => {
                        checkout = integration;

                        checkout.paypal.initAuthFlow();
                    },
                    onError: () => {
                        handleError?.('Paypal server reported an error! Please try again later.');
                    },
                    onPaymentMethodReceived: payload => {
                        const { nonce } = payload;

                        if (mode === 'vault') {
                            (async () => {
                                const addRequest = AddPaymentMethodRequest.create({
                                    paymentMethod: {
                                        oneofKind: 'braintree',
                                        braintree: {
                                            nonce: {
                                                value: nonce,
                                            },
                                            deviceData: {
                                                value: checkout.deviceData,
                                            },
                                        },
                                    },
                                });

                                const response = await grpcRequest(BillingClient, c => c.addPaymentMethod, addRequest);

                                if (response.result && response.paymentMethodItem) {
                                    handleSelect(response.paymentMethodItem);
                                }
                            })();
                        } else if (mode === 'once') {
                            handleSelect(nonce);
                        }
                    },
                    paypal: {
                        currency: 'USD',
                        flow: mode === 'once' ? 'checkout' : 'vault',
                        amount: mode === 'once' ? amount : undefined,
                        singleUse: mode === 'once',
                        commit: true,
                        headless: true,
                        onAuthorizationDismissed: () => {
                            handleError?.('Authorization Dismissed.');
                        },
                    },
                });
            }
        };

        if (enabled) {
            if (ready || typeof braintree !== 'undefined') {
                startCheckout();
            }
        }

        return () => {
            teardown();
        };
    }, [amount, enabled, grpcRequest, handleError, handleSelect, mode, ready]);

    if (!enabled) {
        return null;
    }

    return <Script src="https://js.braintreegateway.com/js/braintree-2.32.1.min.js" onLoad={handleLoad}></Script>;
}
