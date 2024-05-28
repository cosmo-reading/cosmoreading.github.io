import { PaymentMethodGateway } from '@app/_proto/Protos/payments';

type Props = {
    gateway: PaymentMethodGateway | undefined;
};

export const WebGateways = [PaymentMethodGateway.None, PaymentMethodGateway.Stripe, PaymentMethodGateway.Braintree];

const getAppPaymentGatewayName = (paymentGateway: PaymentMethodGateway | undefined) => {
    switch (paymentGateway) {
        case PaymentMethodGateway.Apple:
            return 'Apple';
        case PaymentMethodGateway.GooglePlay:
            return 'Google Play';
        default:
            return '-';
    }
};

export default function ChampionOtherGatewayBox({ gateway }: Props) {
    return (
        <div className="!mt-24 py-20 text-center">
            <p className="font-set-sb18 text-gray-t0">
                Please see {getAppPaymentGatewayName(gateway)} for additional details on your subscription
            </p>
        </div>
    );
}
