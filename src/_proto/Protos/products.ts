// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size,long_type_number,generate_dependencies
// @generated from protobuf file "Protos/products.proto" (package "wuxiaworld.api.v2", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
import { DoubleValue } from "../google/protobuf/wrappers";
import { OrderItem } from "./orders";
import { StringValue } from "../google/protobuf/wrappers";
import { PaymentMethodType } from "./payments";
import { PaymentMethodGateway } from "./payments";
import { DecimalValue } from "./types";
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetProductRequest
 */
export interface GetProductRequest {
    /**
     * @generated from protobuf oneof: id
     */
    id: {
        oneofKind: "productId";
        /**
         * @generated from protobuf field: int32 productId = 1;
         */
        productId: number;
    } | {
        oneofKind: "platformProductId";
        /**
         * @generated from protobuf field: wuxiaworld.api.v2.PlatformProductId platformProductId = 2;
         */
        platformProductId: PlatformProductId;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetProductResponse
 */
export interface GetProductResponse {
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.ProductItem item = 1;
     */
    item?: ProductItem;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetProductsRequest
 */
export interface GetProductsRequest {
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.ProductType type = 1;
     */
    type: ProductType;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetProductsResponse
 */
export interface GetProductsResponse {
    /**
     * @generated from protobuf field: repeated wuxiaworld.api.v2.ProductItem items = 1;
     */
    items: ProductItem[];
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetProductCostRequest
 */
export interface GetProductCostRequest {
    /**
     * @generated from protobuf field: int32 productId = 1;
     */
    productId: number;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetProductCostResponse
 */
export interface GetProductCostResponse {
    /**
     * @generated from protobuf field: customTypes.DecimalValue cost = 1;
     */
    cost?: DecimalValue;
    /**
     * @generated from protobuf field: repeated wuxiaworld.api.v2.ProductDiscount discounts = 2;
     */
    discounts: ProductDiscount[];
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.PurchaseProductRequest
 */
export interface PurchaseProductRequest {
    /**
     * @generated from protobuf field: int32 productId = 1;
     */
    productId: number;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PaymentMethodGateway paymentGateway = 2;
     */
    paymentGateway: PaymentMethodGateway;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PaymentMethodType paymentMethodType = 3;
     */
    paymentMethodType: PaymentMethodType;
    /**
     * @generated from protobuf oneof: paymentMethod
     */
    paymentMethod: {
        oneofKind: "paymentMethodId";
        /**
         * @generated from protobuf field: google.protobuf.StringValue paymentMethodId = 4;
         */
        paymentMethodId: StringValue;
    } | {
        oneofKind: "paymentToken";
        /**
         * @generated from protobuf field: google.protobuf.StringValue paymentToken = 5;
         */
        paymentToken: StringValue;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: customTypes.DecimalValue confirmPrice = 6;
     */
    confirmPrice?: DecimalValue;
    /**
     * @generated from protobuf field: google.protobuf.StringValue couponId = 7;
     */
    couponId?: StringValue;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.ProductPlatform platform = 8;
     */
    platform: ProductPlatform;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.PurchaseProductResponse
 */
export interface PurchaseProductResponse {
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PurchaseProductResponse.ResultState resultState = 1;
     */
    resultState: PurchaseProductResponse_ResultState;
    /**
     * @generated from protobuf field: google.protobuf.StringValue token = 2;
     */
    token?: StringValue;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.OrderItem order = 3;
     */
    order?: OrderItem;
}
/**
 * @generated from protobuf enum wuxiaworld.api.v2.PurchaseProductResponse.ResultState
 */
export enum PurchaseProductResponse_ResultState {
    /**
     * @generated from protobuf enum value: Completed = 0;
     */
    Completed = 0,
    /**
     * @generated from protobuf enum value: PendingConfirmation = 1;
     */
    PendingConfirmation = 1
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.ProductDiscount
 */
export interface ProductDiscount {
    /**
     * @generated from protobuf field: customTypes.DecimalValue discount = 1;
     */
    discount?: DecimalValue;
    /**
     * @generated from protobuf field: google.protobuf.StringValue description = 2;
     */
    description?: StringValue;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.ProductItem
 */
export interface ProductItem {
    /**
     * @generated from protobuf field: int32 id = 1;
     */
    id: number;
    /**
     * @generated from protobuf field: string name = 2;
     */
    name: string;
    /**
     * @generated from protobuf field: customTypes.DecimalValue price = 3;
     */
    price?: DecimalValue;
    /**
     * @generated from protobuf field: int32 quantity = 4;
     */
    quantity: number;
    /**
     * @generated from protobuf field: google.protobuf.StringValue description = 5;
     */
    description?: StringValue;
    /**
     * @generated from protobuf field: bool enabled = 6;
     */
    enabled: boolean;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.ProductType type = 7;
     */
    type: ProductType;
    /**
     * @generated from protobuf field: bool isSubscription = 8;
     */
    isSubscription: boolean;
    /**
     * @generated from protobuf field: repeated wuxiaworld.api.v2.PlatformProductId productIds = 9;
     */
    productIds: PlatformProductId[];
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.ProductItem.ProductReviewInfo reviewInfo = 10;
     */
    reviewInfo?: ProductItem_ProductReviewInfo;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.ProductItem.ProductReviewInfo
 */
export interface ProductItem_ProductReviewInfo {
    /**
     * @generated from protobuf field: int32 count = 1;
     */
    count: number;
    /**
     * @generated from protobuf field: google.protobuf.DoubleValue rating = 2;
     */
    rating?: DoubleValue;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.PlatformProductId
 */
export interface PlatformProductId {
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.ProductPlatform platform = 1;
     */
    platform: ProductPlatform;
    /**
     * @generated from protobuf field: string productId = 2;
     */
    productId: string;
}
/**
 * @generated from protobuf enum wuxiaworld.api.v2.ProductPlatform
 */
export enum ProductPlatform {
    /**
     * @generated from protobuf enum value: WebProduct = 0;
     */
    WebProduct = 0,
    /**
     * @generated from protobuf enum value: AppleProduct = 1;
     */
    AppleProduct = 1,
    /**
     * @generated from protobuf enum value: AndroidProduct = 2;
     */
    AndroidProduct = 2
}
/**
 * @generated from protobuf enum wuxiaworld.api.v2.ProductType
 */
export enum ProductType {
    /**
     * @generated from protobuf enum value: UnknownProduct = 0;
     */
    UnknownProduct = 0,
    /**
     * @generated from protobuf enum value: KarmaProduct = 1;
     */
    KarmaProduct = 1,
    /**
     * @generated from protobuf enum value: EbookProduct = 2;
     */
    EbookProduct = 2,
    /**
     * @generated from protobuf enum value: VipProduct = 3;
     */
    VipProduct = 3,
    /**
     * @generated from protobuf enum value: AudiobookProduct = 4;
     */
    AudiobookProduct = 4
}
// @generated message type with reflection information, may provide speed optimized methods
class GetProductRequest$Type extends MessageType<GetProductRequest> {
    constructor() {
        super("wuxiaworld.api.v2.GetProductRequest", [
            { no: 1, name: "productId", kind: "scalar", oneof: "id", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "platformProductId", kind: "message", oneof: "id", T: () => PlatformProductId }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetProductRequest
 */
export const GetProductRequest = new GetProductRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetProductResponse$Type extends MessageType<GetProductResponse> {
    constructor() {
        super("wuxiaworld.api.v2.GetProductResponse", [
            { no: 1, name: "item", kind: "message", T: () => ProductItem }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetProductResponse
 */
export const GetProductResponse = new GetProductResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetProductsRequest$Type extends MessageType<GetProductsRequest> {
    constructor() {
        super("wuxiaworld.api.v2.GetProductsRequest", [
            { no: 1, name: "type", kind: "enum", T: () => ["wuxiaworld.api.v2.ProductType", ProductType] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetProductsRequest
 */
export const GetProductsRequest = new GetProductsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetProductsResponse$Type extends MessageType<GetProductsResponse> {
    constructor() {
        super("wuxiaworld.api.v2.GetProductsResponse", [
            { no: 1, name: "items", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ProductItem }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetProductsResponse
 */
export const GetProductsResponse = new GetProductsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetProductCostRequest$Type extends MessageType<GetProductCostRequest> {
    constructor() {
        super("wuxiaworld.api.v2.GetProductCostRequest", [
            { no: 1, name: "productId", kind: "scalar", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetProductCostRequest
 */
export const GetProductCostRequest = new GetProductCostRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetProductCostResponse$Type extends MessageType<GetProductCostResponse> {
    constructor() {
        super("wuxiaworld.api.v2.GetProductCostResponse", [
            { no: 1, name: "cost", kind: "message", T: () => DecimalValue },
            { no: 2, name: "discounts", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ProductDiscount }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetProductCostResponse
 */
export const GetProductCostResponse = new GetProductCostResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class PurchaseProductRequest$Type extends MessageType<PurchaseProductRequest> {
    constructor() {
        super("wuxiaworld.api.v2.PurchaseProductRequest", [
            { no: 1, name: "productId", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "paymentGateway", kind: "enum", T: () => ["wuxiaworld.api.v2.PaymentMethodGateway", PaymentMethodGateway] },
            { no: 3, name: "paymentMethodType", kind: "enum", T: () => ["wuxiaworld.api.v2.PaymentMethodType", PaymentMethodType] },
            { no: 4, name: "paymentMethodId", kind: "message", oneof: "paymentMethod", T: () => StringValue },
            { no: 5, name: "paymentToken", kind: "message", oneof: "paymentMethod", T: () => StringValue },
            { no: 6, name: "confirmPrice", kind: "message", T: () => DecimalValue },
            { no: 7, name: "couponId", kind: "message", T: () => StringValue },
            { no: 8, name: "platform", kind: "enum", T: () => ["wuxiaworld.api.v2.ProductPlatform", ProductPlatform] }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.PurchaseProductRequest
 */
export const PurchaseProductRequest = new PurchaseProductRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class PurchaseProductResponse$Type extends MessageType<PurchaseProductResponse> {
    constructor() {
        super("wuxiaworld.api.v2.PurchaseProductResponse", [
            { no: 1, name: "resultState", kind: "enum", T: () => ["wuxiaworld.api.v2.PurchaseProductResponse.ResultState", PurchaseProductResponse_ResultState] },
            { no: 2, name: "token", kind: "message", T: () => StringValue },
            { no: 3, name: "order", kind: "message", T: () => OrderItem }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.PurchaseProductResponse
 */
export const PurchaseProductResponse = new PurchaseProductResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ProductDiscount$Type extends MessageType<ProductDiscount> {
    constructor() {
        super("wuxiaworld.api.v2.ProductDiscount", [
            { no: 1, name: "discount", kind: "message", T: () => DecimalValue },
            { no: 2, name: "description", kind: "message", T: () => StringValue }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.ProductDiscount
 */
export const ProductDiscount = new ProductDiscount$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ProductItem$Type extends MessageType<ProductItem> {
    constructor() {
        super("wuxiaworld.api.v2.ProductItem", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "price", kind: "message", T: () => DecimalValue },
            { no: 4, name: "quantity", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 5, name: "description", kind: "message", T: () => StringValue },
            { no: 6, name: "enabled", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 7, name: "type", kind: "enum", T: () => ["wuxiaworld.api.v2.ProductType", ProductType] },
            { no: 8, name: "isSubscription", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 9, name: "productIds", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => PlatformProductId },
            { no: 10, name: "reviewInfo", kind: "message", T: () => ProductItem_ProductReviewInfo }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.ProductItem
 */
export const ProductItem = new ProductItem$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ProductItem_ProductReviewInfo$Type extends MessageType<ProductItem_ProductReviewInfo> {
    constructor() {
        super("wuxiaworld.api.v2.ProductItem.ProductReviewInfo", [
            { no: 1, name: "count", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "rating", kind: "message", T: () => DoubleValue }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.ProductItem.ProductReviewInfo
 */
export const ProductItem_ProductReviewInfo = new ProductItem_ProductReviewInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class PlatformProductId$Type extends MessageType<PlatformProductId> {
    constructor() {
        super("wuxiaworld.api.v2.PlatformProductId", [
            { no: 1, name: "platform", kind: "enum", T: () => ["wuxiaworld.api.v2.ProductPlatform", ProductPlatform] },
            { no: 2, name: "productId", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.PlatformProductId
 */
export const PlatformProductId = new PlatformProductId$Type();
/**
 * @generated ServiceType for protobuf service wuxiaworld.api.v2.Products
 */
export const Products = new ServiceType("wuxiaworld.api.v2.Products", [
    { name: "GetProduct", options: {}, I: GetProductRequest, O: GetProductResponse },
    { name: "GetProducts", options: {}, I: GetProductsRequest, O: GetProductsResponse },
    { name: "GetProductCost", options: {}, I: GetProductCostRequest, O: GetProductCostResponse },
    { name: "PurchaseProduct", options: {}, I: PurchaseProductRequest, O: PurchaseProductResponse }
]);
