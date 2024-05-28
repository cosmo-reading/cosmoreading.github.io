// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size,long_type_number,generate_dependencies
// @generated from protobuf file "Protos/payments.proto" (package "wuxiaworld.api.v2", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
import { DecimalValue } from "./types";
import { StringValue } from "../google/protobuf/wrappers";
/**
 * @generated from protobuf message wuxiaworld.api.v2.PaymentMethodItem
 */
export interface PaymentMethodItem {
    /**
     * @generated from protobuf field: google.protobuf.StringValue id = 1;
     */
    id?: StringValue;
    /**
     * @generated from protobuf field: string fullName = 2;
     */
    fullName: string;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PaymentMethodType type = 3;
     */
    type: PaymentMethodType;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PaymentMethodGateway gateway = 4;
     */
    gateway: PaymentMethodGateway;
    /**
     * @generated from protobuf field: string label = 5;
     */
    label: string;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PaymentMethodItem.CardDetails cardDetails = 6;
     */
    cardDetails?: PaymentMethodItem_CardDetails;
    /**
     * @generated from protobuf field: bool isDefault = 7;
     */
    isDefault: boolean;
    /**
     * @generated from protobuf field: customTypes.DecimalValue balance = 8;
     */
    balance?: DecimalValue;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.PaymentMethodItem.CardDetails
 */
export interface PaymentMethodItem_CardDetails {
    /**
     * @generated from protobuf field: string brand = 1;
     */
    brand: string;
    /**
     * @generated from protobuf field: string last4 = 2;
     */
    last4: string;
}
/**
 * @generated from protobuf enum wuxiaworld.api.v2.PaymentMethodType
 */
export enum PaymentMethodType {
    /**
     * @generated from protobuf enum value: UnknownType = 0;
     */
    UnknownType = 0,
    /**
     * @generated from protobuf enum value: CardType = 1;
     */
    CardType = 1,
    /**
     * @generated from protobuf enum value: PayPalType = 2;
     */
    PayPalType = 2,
    /**
     * @generated from protobuf enum value: KarmaType = 3;
     */
    KarmaType = 3,
    /**
     * @generated from protobuf enum value: SiteCreditsType = 4;
     */
    SiteCreditsType = 4,
    /**
     * @generated from protobuf enum value: EbookVouchersType = 5;
     */
    EbookVouchersType = 5
}
/**
 * @generated from protobuf enum wuxiaworld.api.v2.PaymentMethodGateway
 */
export enum PaymentMethodGateway {
    /**
     * @generated from protobuf enum value: None = 0;
     */
    None = 0,
    /**
     * @generated from protobuf enum value: Stripe = 1;
     */
    Stripe = 1,
    /**
     * @generated from protobuf enum value: Braintree = 2;
     */
    Braintree = 2,
    /**
     * @generated from protobuf enum value: Apple = 3;
     */
    Apple = 3,
    /**
     * @generated from protobuf enum value: GooglePlay = 4;
     */
    GooglePlay = 4,
    /**
     * @generated from protobuf enum value: StripeCheckout = 5;
     */
    StripeCheckout = 5,
    /**
     * @generated from protobuf enum value: Wuxiaworld = 6;
     */
    Wuxiaworld = 6,
    /**
     * @generated from protobuf enum value: AppleSK2 = 7;
     */
    AppleSK2 = 7
}
// @generated message type with reflection information, may provide speed optimized methods
class PaymentMethodItem$Type extends MessageType<PaymentMethodItem> {
    constructor() {
        super("wuxiaworld.api.v2.PaymentMethodItem", [
            { no: 1, name: "id", kind: "message", T: () => StringValue },
            { no: 2, name: "fullName", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "type", kind: "enum", T: () => ["wuxiaworld.api.v2.PaymentMethodType", PaymentMethodType] },
            { no: 4, name: "gateway", kind: "enum", T: () => ["wuxiaworld.api.v2.PaymentMethodGateway", PaymentMethodGateway] },
            { no: 5, name: "label", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 6, name: "cardDetails", kind: "message", T: () => PaymentMethodItem_CardDetails },
            { no: 7, name: "isDefault", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 8, name: "balance", kind: "message", T: () => DecimalValue }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.PaymentMethodItem
 */
export const PaymentMethodItem = new PaymentMethodItem$Type();
// @generated message type with reflection information, may provide speed optimized methods
class PaymentMethodItem_CardDetails$Type extends MessageType<PaymentMethodItem_CardDetails> {
    constructor() {
        super("wuxiaworld.api.v2.PaymentMethodItem.CardDetails", [
            { no: 1, name: "brand", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "last4", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.PaymentMethodItem.CardDetails
 */
export const PaymentMethodItem_CardDetails = new PaymentMethodItem_CardDetails$Type();
