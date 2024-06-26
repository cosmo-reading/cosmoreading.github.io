// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size,long_type_number,generate_dependencies
// @generated from protobuf file "Protos/subscriptions.proto" (package "wuxiaworld.api.v2", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
import { Int32Value } from "../google/protobuf/wrappers";
import { SponsorPlanItem } from "./sponsors";
import { VipItem } from "./vips";
import { Int64Value } from "../google/protobuf/wrappers";
import { BillingPeriod } from "./billing";
import { Timestamp } from "../google/protobuf/timestamp";
import { DecimalValue } from "./types";
import { PaymentMethodGateway } from "./payments";
import { StringValue } from "../google/protobuf/wrappers";
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetSubscriptionsRequest
 */
export interface GetSubscriptionsRequest {
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.GetSubscriptionsRequest.Type type = 1;
     */
    type: GetSubscriptionsRequest_Type;
    /**
     * @generated from protobuf oneof: selector
     */
    selector: {
        oneofKind: "novelId";
        /**
         * @generated from protobuf field: int32 novelId = 2;
         */
        novelId: number;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf enum wuxiaworld.api.v2.GetSubscriptionsRequest.Type
 */
export enum GetSubscriptionsRequest_Type {
    /**
     * @generated from protobuf enum value: All = 0;
     */
    All = 0,
    /**
     * @generated from protobuf enum value: Vip = 1;
     */
    Vip = 1,
    /**
     * @generated from protobuf enum value: Sponsor = 2;
     */
    Sponsor = 2
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetSubscriptionsResponse
 */
export interface GetSubscriptionsResponse {
    /**
     * @generated from protobuf field: repeated wuxiaworld.api.v2.SubscriptionItem items = 1;
     */
    items: SubscriptionItem[];
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetSubscriptionRequest
 */
export interface GetSubscriptionRequest {
    /**
     * @generated from protobuf field: int32 id = 1;
     */
    id: number;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.SubscriptionType type = 2;
     */
    type: SubscriptionType;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetSubscriptionResponse
 */
export interface GetSubscriptionResponse {
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.SubscriptionItem item = 1;
     */
    item?: SubscriptionItem;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetGatewaySubscriptionsRequest
 */
export interface GetGatewaySubscriptionsRequest {
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.GetGatewaySubscriptionsRequest.Filters filters = 1;
     */
    filters?: GetGatewaySubscriptionsRequest_Filters;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetGatewaySubscriptionsRequest.Filters
 */
export interface GetGatewaySubscriptionsRequest_Filters {
    /**
     * @generated from protobuf field: google.protobuf.StringValue paymentMethodId = 1;
     */
    paymentMethodId?: StringValue;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PaymentMethodGateway paymentGateway = 2;
     */
    paymentGateway: PaymentMethodGateway;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetGatewaySubscriptionsResponse
 */
export interface GetGatewaySubscriptionsResponse {
    /**
     * @generated from protobuf field: repeated wuxiaworld.api.v2.SubscriptionItem items = 1;
     */
    items: SubscriptionItem[];
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.CreateSubscriptionRequest
 */
export interface CreateSubscriptionRequest {
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PaymentMethodGateway paymentGateway = 1;
     */
    paymentGateway: PaymentMethodGateway;
    /**
     * @generated from protobuf oneof: paymentMethod
     */
    paymentMethod: {
        oneofKind: "paymentMethodId";
        /**
         * @generated from protobuf field: google.protobuf.StringValue paymentMethodId = 2;
         */
        paymentMethodId: StringValue;
    } | {
        oneofKind: "paymentToken";
        /**
         * @generated from protobuf field: google.protobuf.StringValue paymentToken = 3;
         */
        paymentToken: StringValue;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf oneof: plan
     */
    plan: {
        oneofKind: "vipPlanId";
        /**
         * @generated from protobuf field: int32 vipPlanId = 4;
         */
        vipPlanId: number;
    } | {
        oneofKind: "sponsorPlanId";
        /**
         * @generated from protobuf field: int32 sponsorPlanId = 5;
         */
        sponsorPlanId: number;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.SubscriptionPlatform platform = 6;
     */
    platform: SubscriptionPlatform;
    /**
     * @generated from protobuf field: customTypes.DecimalValue confirmPrice = 7;
     */
    confirmPrice?: DecimalValue;
    /**
     * @generated from protobuf field: google.protobuf.StringValue couponId = 8;
     */
    couponId?: StringValue;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.CreateSubscriptionResponse
 */
export interface CreateSubscriptionResponse {
    /**
     * @generated from protobuf field: bool result = 1;
     */
    result: boolean;
    /**
     * @generated from protobuf field: google.protobuf.Timestamp startDate = 2;
     */
    startDate?: Timestamp;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.BillingPeriod billingPeriod = 3;
     */
    billingPeriod?: BillingPeriod;
    /**
     * @generated from protobuf field: google.protobuf.StringValue confirmToken = 4;
     */
    confirmToken?: StringValue;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.SubscriptionItem item = 5;
     */
    item?: SubscriptionItem;
    /**
     * @generated from protobuf field: bool isPending = 6;
     */
    isPending: boolean;
    /**
     * @generated from protobuf field: google.protobuf.StringValue subscriptionId = 7;
     */
    subscriptionId?: StringValue;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.UpdateSubscriptionRequest
 */
export interface UpdateSubscriptionRequest {
    /**
     * @generated from protobuf field: int32 id = 1;
     */
    id: number;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PaymentMethodGateway paymentGateway = 2;
     */
    paymentGateway: PaymentMethodGateway;
    /**
     * @generated from protobuf oneof: paymentMethod
     */
    paymentMethod: {
        oneofKind: "paymentMethodId";
        /**
         * @generated from protobuf field: google.protobuf.StringValue paymentMethodId = 3;
         */
        paymentMethodId: StringValue;
    } | {
        oneofKind: "paymentToken";
        /**
         * @generated from protobuf field: google.protobuf.StringValue paymentToken = 4;
         */
        paymentToken: StringValue;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf oneof: plan
     */
    plan: {
        oneofKind: "vipPlanId";
        /**
         * @generated from protobuf field: int32 vipPlanId = 5;
         */
        vipPlanId: number;
    } | {
        oneofKind: "sponsorPlanId";
        /**
         * @generated from protobuf field: int32 sponsorPlanId = 6;
         */
        sponsorPlanId: number;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.SubscriptionPlatform platform = 7;
     */
    platform: SubscriptionPlatform;
    /**
     * @generated from protobuf field: customTypes.DecimalValue confirmPrice = 8;
     */
    confirmPrice?: DecimalValue;
    /**
     * @generated from protobuf field: google.protobuf.StringValue couponId = 9;
     */
    couponId?: StringValue;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.UpdateSubscriptionResponse
 */
export interface UpdateSubscriptionResponse {
    /**
     * @generated from protobuf field: bool result = 1;
     */
    result: boolean;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.BillingPeriod billingPeriod = 2;
     */
    billingPeriod?: BillingPeriod;
    /**
     * @generated from protobuf field: bool isPending = 3;
     */
    isPending: boolean;
    /**
     * @generated from protobuf field: google.protobuf.StringValue confirmToken = 4;
     */
    confirmToken?: StringValue;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.SubscriptionItem item = 5;
     */
    item?: SubscriptionItem;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.CancelSubscriptionRequest
 */
export interface CancelSubscriptionRequest {
    /**
     * @generated from protobuf field: int32 id = 1;
     */
    id: number;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.SubscriptionType type = 2;
     */
    type: SubscriptionType;
    /**
     * @generated from protobuf field: google.protobuf.StringValue reason = 3;
     */
    reason?: StringValue;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.CancelSubscriptionResponse
 */
export interface CancelSubscriptionResponse {
    /**
     * @generated from protobuf field: bool result = 1;
     */
    result: boolean;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.SubscriptionItem canceledSubscription = 2;
     */
    canceledSubscription?: SubscriptionItem;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetSubscriptionCostRequest
 */
export interface GetSubscriptionCostRequest {
    /**
     * @generated from protobuf field: bool isUpgrade = 1;
     */
    isUpgrade: boolean;
    /**
     * @generated from protobuf oneof: plan
     */
    plan: {
        oneofKind: "vipPlanId";
        /**
         * @generated from protobuf field: int32 vipPlanId = 2;
         */
        vipPlanId: number;
    } | {
        oneofKind: "sponsorPlan";
        /**
         * @generated from protobuf field: wuxiaworld.api.v2.GetSubscriptionCostRequest.SponsorPlan sponsorPlan = 3;
         */
        sponsorPlan: GetSubscriptionCostRequest_SponsorPlan;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: google.protobuf.StringValue couponId = 4;
     */
    couponId?: StringValue;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PaymentMethodGateway paymentGateway = 5;
     */
    paymentGateway: PaymentMethodGateway;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetSubscriptionCostRequest.SponsorPlan
 */
export interface GetSubscriptionCostRequest_SponsorPlan {
    /**
     * @generated from protobuf field: int32 planId = 1;
     */
    planId: number;
    /**
     * @generated from protobuf field: int32 novelId = 2;
     */
    novelId: number;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetSubscriptionCostResponse
 */
export interface GetSubscriptionCostResponse {
    /**
     * @generated from protobuf field: customTypes.DecimalValue total = 1;
     */
    total?: DecimalValue;
    /**
     * @generated from protobuf field: bool isDowngrade = 2;
     */
    isDowngrade: boolean;
    /**
     * @generated from protobuf field: repeated wuxiaworld.api.v2.SubscriptionLineItem lineItems = 3;
     */
    lineItems: SubscriptionLineItem[];
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.SubscriptionLineItem
 */
export interface SubscriptionLineItem {
    /**
     * @generated from protobuf field: customTypes.DecimalValue amount = 1;
     */
    amount?: DecimalValue;
    /**
     * @generated from protobuf field: google.protobuf.StringValue description = 2;
     */
    description?: StringValue;
    /**
     * @generated from protobuf field: bool isProration = 3;
     */
    isProration: boolean;
    /**
     * @generated from protobuf field: bool isDiscount = 4;
     */
    isDiscount: boolean;
    /**
     * @generated from protobuf field: google.protobuf.Int64Value quantity = 5;
     */
    quantity?: Int64Value;
    /**
     * @generated from protobuf field: map<string, string> metadata = 6;
     */
    metadata: {
        [key: string]: string;
    };
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.SubscriptionItem
 */
export interface SubscriptionItem {
    /**
     * @generated from protobuf field: int32 id = 1;
     */
    id: number;
    /**
     * @generated from protobuf field: bool active = 2;
     */
    active: boolean;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.SubscriptionItem.Plan plan = 3;
     */
    plan?: SubscriptionItem_Plan;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.BillingPeriod billingPeriod = 4;
     */
    billingPeriod?: BillingPeriod;
    /**
     * @generated from protobuf field: google.protobuf.Timestamp subscriptionEndedAt = 5;
     */
    subscriptionEndedAt?: Timestamp;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.SubscriptionItem.Plan pendingPlan = 6;
     */
    pendingPlan?: SubscriptionItem_Plan;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PaymentMethodGateway paymentGateway = 7;
     */
    paymentGateway: PaymentMethodGateway;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.SubscriptionType type = 8;
     */
    type: SubscriptionType;
    /**
     * @generated from protobuf field: google.protobuf.StringValue gatewayId = 9;
     */
    gatewayId?: StringValue;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.SubscriptionItem.Plan
 */
export interface SubscriptionItem_Plan {
    /**
     * @generated from protobuf oneof: plan
     */
    plan: {
        oneofKind: "vip";
        /**
         * @generated from protobuf field: wuxiaworld.api.v2.VipItem vip = 1;
         */
        vip: VipItem;
    } | {
        oneofKind: "sponsor";
        /**
         * @generated from protobuf field: wuxiaworld.api.v2.SponsorPlanItem sponsor = 2;
         */
        sponsor: SponsorPlanItem;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: google.protobuf.Int32Value productId = 3;
     */
    productId?: Int32Value;
}
/**
 * @generated from protobuf enum wuxiaworld.api.v2.SubscriptionType
 */
export enum SubscriptionType {
    /**
     * @generated from protobuf enum value: VipSubscription = 0;
     */
    VipSubscription = 0,
    /**
     * @generated from protobuf enum value: SponsorSubscription = 1;
     */
    SponsorSubscription = 1
}
/**
 * @generated from protobuf enum wuxiaworld.api.v2.SubscriptionSource
 */
export enum SubscriptionSource {
    /**
     * @generated from protobuf enum value: ManualSource = 0;
     */
    ManualSource = 0,
    /**
     * @generated from protobuf enum value: StripeSource = 1;
     */
    StripeSource = 1,
    /**
     * @generated from protobuf enum value: KarmaSource = 2;
     */
    KarmaSource = 2
}
/**
 * @generated from protobuf enum wuxiaworld.api.v2.SubscriptionPlatform
 */
export enum SubscriptionPlatform {
    /**
     * @generated from protobuf enum value: WebSubscription = 0;
     */
    WebSubscription = 0,
    /**
     * @generated from protobuf enum value: AppleSubscription = 1;
     */
    AppleSubscription = 1,
    /**
     * @generated from protobuf enum value: AndroidSubscription = 2;
     */
    AndroidSubscription = 2,
    /**
     * @generated from protobuf enum value: KarmaSubscription = 3;
     */
    KarmaSubscription = 3
}
// @generated message type with reflection information, may provide speed optimized methods
class GetSubscriptionsRequest$Type extends MessageType<GetSubscriptionsRequest> {
    constructor() {
        super("wuxiaworld.api.v2.GetSubscriptionsRequest", [
            { no: 1, name: "type", kind: "enum", T: () => ["wuxiaworld.api.v2.GetSubscriptionsRequest.Type", GetSubscriptionsRequest_Type] },
            { no: 2, name: "novelId", kind: "scalar", oneof: "selector", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetSubscriptionsRequest
 */
export const GetSubscriptionsRequest = new GetSubscriptionsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetSubscriptionsResponse$Type extends MessageType<GetSubscriptionsResponse> {
    constructor() {
        super("wuxiaworld.api.v2.GetSubscriptionsResponse", [
            { no: 1, name: "items", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => SubscriptionItem }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetSubscriptionsResponse
 */
export const GetSubscriptionsResponse = new GetSubscriptionsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetSubscriptionRequest$Type extends MessageType<GetSubscriptionRequest> {
    constructor() {
        super("wuxiaworld.api.v2.GetSubscriptionRequest", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "type", kind: "enum", T: () => ["wuxiaworld.api.v2.SubscriptionType", SubscriptionType] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetSubscriptionRequest
 */
export const GetSubscriptionRequest = new GetSubscriptionRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetSubscriptionResponse$Type extends MessageType<GetSubscriptionResponse> {
    constructor() {
        super("wuxiaworld.api.v2.GetSubscriptionResponse", [
            { no: 1, name: "item", kind: "message", T: () => SubscriptionItem }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetSubscriptionResponse
 */
export const GetSubscriptionResponse = new GetSubscriptionResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetGatewaySubscriptionsRequest$Type extends MessageType<GetGatewaySubscriptionsRequest> {
    constructor() {
        super("wuxiaworld.api.v2.GetGatewaySubscriptionsRequest", [
            { no: 1, name: "filters", kind: "message", T: () => GetGatewaySubscriptionsRequest_Filters }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetGatewaySubscriptionsRequest
 */
export const GetGatewaySubscriptionsRequest = new GetGatewaySubscriptionsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetGatewaySubscriptionsRequest_Filters$Type extends MessageType<GetGatewaySubscriptionsRequest_Filters> {
    constructor() {
        super("wuxiaworld.api.v2.GetGatewaySubscriptionsRequest.Filters", [
            { no: 1, name: "paymentMethodId", kind: "message", T: () => StringValue },
            { no: 2, name: "paymentGateway", kind: "enum", T: () => ["wuxiaworld.api.v2.PaymentMethodGateway", PaymentMethodGateway] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetGatewaySubscriptionsRequest.Filters
 */
export const GetGatewaySubscriptionsRequest_Filters = new GetGatewaySubscriptionsRequest_Filters$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetGatewaySubscriptionsResponse$Type extends MessageType<GetGatewaySubscriptionsResponse> {
    constructor() {
        super("wuxiaworld.api.v2.GetGatewaySubscriptionsResponse", [
            { no: 1, name: "items", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => SubscriptionItem }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetGatewaySubscriptionsResponse
 */
export const GetGatewaySubscriptionsResponse = new GetGatewaySubscriptionsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CreateSubscriptionRequest$Type extends MessageType<CreateSubscriptionRequest> {
    constructor() {
        super("wuxiaworld.api.v2.CreateSubscriptionRequest", [
            { no: 1, name: "paymentGateway", kind: "enum", T: () => ["wuxiaworld.api.v2.PaymentMethodGateway", PaymentMethodGateway] },
            { no: 2, name: "paymentMethodId", kind: "message", oneof: "paymentMethod", T: () => StringValue },
            { no: 3, name: "paymentToken", kind: "message", oneof: "paymentMethod", T: () => StringValue },
            { no: 4, name: "vipPlanId", kind: "scalar", oneof: "plan", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "sponsorPlanId", kind: "scalar", oneof: "plan", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "platform", kind: "enum", T: () => ["wuxiaworld.api.v2.SubscriptionPlatform", SubscriptionPlatform] },
            { no: 7, name: "confirmPrice", kind: "message", T: () => DecimalValue },
            { no: 8, name: "couponId", kind: "message", T: () => StringValue }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.CreateSubscriptionRequest
 */
export const CreateSubscriptionRequest = new CreateSubscriptionRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CreateSubscriptionResponse$Type extends MessageType<CreateSubscriptionResponse> {
    constructor() {
        super("wuxiaworld.api.v2.CreateSubscriptionResponse", [
            { no: 1, name: "result", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "startDate", kind: "message", T: () => Timestamp },
            { no: 3, name: "billingPeriod", kind: "message", T: () => BillingPeriod },
            { no: 4, name: "confirmToken", kind: "message", T: () => StringValue },
            { no: 5, name: "item", kind: "message", T: () => SubscriptionItem },
            { no: 6, name: "isPending", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 7, name: "subscriptionId", kind: "message", T: () => StringValue }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.CreateSubscriptionResponse
 */
export const CreateSubscriptionResponse = new CreateSubscriptionResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UpdateSubscriptionRequest$Type extends MessageType<UpdateSubscriptionRequest> {
    constructor() {
        super("wuxiaworld.api.v2.UpdateSubscriptionRequest", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "paymentGateway", kind: "enum", T: () => ["wuxiaworld.api.v2.PaymentMethodGateway", PaymentMethodGateway] },
            { no: 3, name: "paymentMethodId", kind: "message", oneof: "paymentMethod", T: () => StringValue },
            { no: 4, name: "paymentToken", kind: "message", oneof: "paymentMethod", T: () => StringValue },
            { no: 5, name: "vipPlanId", kind: "scalar", oneof: "plan", T: 5 /*ScalarType.INT32*/ },
            { no: 6, name: "sponsorPlanId", kind: "scalar", oneof: "plan", T: 5 /*ScalarType.INT32*/ },
            { no: 7, name: "platform", kind: "enum", T: () => ["wuxiaworld.api.v2.SubscriptionPlatform", SubscriptionPlatform] },
            { no: 8, name: "confirmPrice", kind: "message", T: () => DecimalValue },
            { no: 9, name: "couponId", kind: "message", T: () => StringValue }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.UpdateSubscriptionRequest
 */
export const UpdateSubscriptionRequest = new UpdateSubscriptionRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UpdateSubscriptionResponse$Type extends MessageType<UpdateSubscriptionResponse> {
    constructor() {
        super("wuxiaworld.api.v2.UpdateSubscriptionResponse", [
            { no: 1, name: "result", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "billingPeriod", kind: "message", T: () => BillingPeriod },
            { no: 3, name: "isPending", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 4, name: "confirmToken", kind: "message", T: () => StringValue },
            { no: 5, name: "item", kind: "message", T: () => SubscriptionItem }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.UpdateSubscriptionResponse
 */
export const UpdateSubscriptionResponse = new UpdateSubscriptionResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CancelSubscriptionRequest$Type extends MessageType<CancelSubscriptionRequest> {
    constructor() {
        super("wuxiaworld.api.v2.CancelSubscriptionRequest", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "type", kind: "enum", T: () => ["wuxiaworld.api.v2.SubscriptionType", SubscriptionType] },
            { no: 3, name: "reason", kind: "message", T: () => StringValue }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.CancelSubscriptionRequest
 */
export const CancelSubscriptionRequest = new CancelSubscriptionRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CancelSubscriptionResponse$Type extends MessageType<CancelSubscriptionResponse> {
    constructor() {
        super("wuxiaworld.api.v2.CancelSubscriptionResponse", [
            { no: 1, name: "result", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "canceledSubscription", kind: "message", T: () => SubscriptionItem }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.CancelSubscriptionResponse
 */
export const CancelSubscriptionResponse = new CancelSubscriptionResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetSubscriptionCostRequest$Type extends MessageType<GetSubscriptionCostRequest> {
    constructor() {
        super("wuxiaworld.api.v2.GetSubscriptionCostRequest", [
            { no: 1, name: "isUpgrade", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 2, name: "vipPlanId", kind: "scalar", oneof: "plan", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "sponsorPlan", kind: "message", oneof: "plan", T: () => GetSubscriptionCostRequest_SponsorPlan },
            { no: 4, name: "couponId", kind: "message", T: () => StringValue },
            { no: 5, name: "paymentGateway", kind: "enum", T: () => ["wuxiaworld.api.v2.PaymentMethodGateway", PaymentMethodGateway] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetSubscriptionCostRequest
 */
export const GetSubscriptionCostRequest = new GetSubscriptionCostRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetSubscriptionCostRequest_SponsorPlan$Type extends MessageType<GetSubscriptionCostRequest_SponsorPlan> {
    constructor() {
        super("wuxiaworld.api.v2.GetSubscriptionCostRequest.SponsorPlan", [
            { no: 1, name: "planId", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "novelId", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetSubscriptionCostRequest.SponsorPlan
 */
export const GetSubscriptionCostRequest_SponsorPlan = new GetSubscriptionCostRequest_SponsorPlan$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetSubscriptionCostResponse$Type extends MessageType<GetSubscriptionCostResponse> {
    constructor() {
        super("wuxiaworld.api.v2.GetSubscriptionCostResponse", [
            { no: 1, name: "total", kind: "message", T: () => DecimalValue },
            { no: 2, name: "isDowngrade", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 3, name: "lineItems", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => SubscriptionLineItem }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetSubscriptionCostResponse
 */
export const GetSubscriptionCostResponse = new GetSubscriptionCostResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SubscriptionLineItem$Type extends MessageType<SubscriptionLineItem> {
    constructor() {
        super("wuxiaworld.api.v2.SubscriptionLineItem", [
            { no: 1, name: "amount", kind: "message", T: () => DecimalValue },
            { no: 2, name: "description", kind: "message", T: () => StringValue },
            { no: 3, name: "isProration", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 4, name: "isDiscount", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 5, name: "quantity", kind: "message", T: () => Int64Value },
            { no: 6, name: "metadata", kind: "map", K: 9 /*ScalarType.STRING*/, V: { kind: "scalar", T: 9 /*ScalarType.STRING*/ } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.SubscriptionLineItem
 */
export const SubscriptionLineItem = new SubscriptionLineItem$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SubscriptionItem$Type extends MessageType<SubscriptionItem> {
    constructor() {
        super("wuxiaworld.api.v2.SubscriptionItem", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "active", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 3, name: "plan", kind: "message", T: () => SubscriptionItem_Plan },
            { no: 4, name: "billingPeriod", kind: "message", T: () => BillingPeriod },
            { no: 5, name: "subscriptionEndedAt", kind: "message", T: () => Timestamp },
            { no: 6, name: "pendingPlan", kind: "message", T: () => SubscriptionItem_Plan },
            { no: 7, name: "paymentGateway", kind: "enum", T: () => ["wuxiaworld.api.v2.PaymentMethodGateway", PaymentMethodGateway] },
            { no: 8, name: "type", kind: "enum", T: () => ["wuxiaworld.api.v2.SubscriptionType", SubscriptionType] },
            { no: 9, name: "gatewayId", kind: "message", T: () => StringValue }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.SubscriptionItem
 */
export const SubscriptionItem = new SubscriptionItem$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SubscriptionItem_Plan$Type extends MessageType<SubscriptionItem_Plan> {
    constructor() {
        super("wuxiaworld.api.v2.SubscriptionItem.Plan", [
            { no: 1, name: "vip", kind: "message", oneof: "plan", T: () => VipItem },
            { no: 2, name: "sponsor", kind: "message", oneof: "plan", T: () => SponsorPlanItem },
            { no: 3, name: "productId", kind: "message", T: () => Int32Value }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.SubscriptionItem.Plan
 */
export const SubscriptionItem_Plan = new SubscriptionItem_Plan$Type();
/**
 * @generated ServiceType for protobuf service wuxiaworld.api.v2.Subscriptions
 */
export const Subscriptions = new ServiceType("wuxiaworld.api.v2.Subscriptions", [
    { name: "GetSubscriptions", options: {}, I: GetSubscriptionsRequest, O: GetSubscriptionsResponse },
    { name: "GetSubscription", options: {}, I: GetSubscriptionRequest, O: GetSubscriptionResponse },
    { name: "GetGatewaySubscriptions", options: {}, I: GetGatewaySubscriptionsRequest, O: GetGatewaySubscriptionsResponse },
    { name: "CreateSubscription", options: {}, I: CreateSubscriptionRequest, O: CreateSubscriptionResponse },
    { name: "UpdateSubscription", options: {}, I: UpdateSubscriptionRequest, O: UpdateSubscriptionResponse },
    { name: "CancelSubscription", options: {}, I: CancelSubscriptionRequest, O: CancelSubscriptionResponse },
    { name: "GetSubscriptionCost", options: {}, I: GetSubscriptionCostRequest, O: GetSubscriptionCostResponse }
]);
