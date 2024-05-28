import { PaymentMethodType } from '@app/_proto/Protos/payments';

export const PAYMENT_METHOD_TYPE_READABLE = {
    [PaymentMethodType.UnknownType]: 'Unknown',
    [PaymentMethodType.CardType]: 'Card',
    [PaymentMethodType.PayPalType]: 'Paypal',
    [PaymentMethodType.KarmaType]: 'Karma',
    [PaymentMethodType.SiteCreditsType]: 'SiteCredits',
    [PaymentMethodType.EbookVouchersType]: 'EbookVouchers',
};
