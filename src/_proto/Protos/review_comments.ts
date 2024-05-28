// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size,long_type_number,generate_dependencies
// @generated from protobuf file "Protos/review_comments.proto" (package "wuxiaworld.api.v2", syntax proto3)
// tslint:disable
import { ServiceType } from "@protobuf-ts/runtime-rpc";
import { MessageType } from "@protobuf-ts/runtime";
import { Timestamp } from "../google/protobuf/timestamp";
import { UserItem } from "./users";
import { PageInfoResponse } from "./pagination";
import { PageInfoRequest } from "./pagination";
/**
 * @generated from protobuf message wuxiaworld.api.v2.CreateReviewCommentRequest
 */
export interface CreateReviewCommentRequest {
    /**
     * @generated from protobuf field: int32 id = 1;
     */
    id: number;
    /**
     * @generated from protobuf field: string content = 2;
     */
    content: string;
    /**
     * @generated from protobuf oneof: type
     */
    type: {
        oneofKind: "novelId";
        /**
         * @generated from protobuf field: int32 novelId = 3;
         */
        novelId: number;
    } | {
        oneofKind: "productId";
        /**
         * @generated from protobuf field: int32 productId = 4;
         */
        productId: number;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.CreateReviewCommentsResponse
 */
export interface CreateReviewCommentsResponse {
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.ReviewCommentItem item = 1;
     */
    item?: ReviewCommentItem;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetReviewCommentsRequest
 */
export interface GetReviewCommentsRequest {
    /**
     * @generated from protobuf field: int32 id = 1;
     */
    id: number;
    /**
     * @generated from protobuf oneof: type
     */
    type: {
        oneofKind: "novelId";
        /**
         * @generated from protobuf field: int32 novelId = 2;
         */
        novelId: number;
    } | {
        oneofKind: "productId";
        /**
         * @generated from protobuf field: int32 productId = 3;
         */
        productId: number;
    } | {
        oneofKind: undefined;
    };
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PageInfoRequest pageInfo = 4;
     */
    pageInfo?: PageInfoRequest;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.GetReviewCommentsResponse
 */
export interface GetReviewCommentsResponse {
    /**
     * @generated from protobuf field: repeated wuxiaworld.api.v2.ReviewCommentItem items = 1;
     */
    items: ReviewCommentItem[];
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.PageInfoResponse pageInfo = 2;
     */
    pageInfo?: PageInfoResponse;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.ReviewCommenterSeriesInfo
 */
export interface ReviewCommenterSeriesInfo {
    /**
     * @generated from protobuf field: bool isChampion = 1;
     */
    isChampion: boolean;
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.ReviewCommenterEntityInfo
 */
export interface ReviewCommenterEntityInfo {
    /**
     * @generated from protobuf oneof: entityInfo
     */
    entityInfo: {
        oneofKind: "seriesInfo";
        /**
         * @generated from protobuf field: wuxiaworld.api.v2.ReviewCommenterSeriesInfo seriesInfo = 1;
         */
        seriesInfo: ReviewCommenterSeriesInfo;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message wuxiaworld.api.v2.ReviewCommentItem
 */
export interface ReviewCommentItem {
    /**
     * @generated from protobuf field: int32 id = 1;
     */
    id: number;
    /**
     * @generated from protobuf field: string content = 2;
     */
    content: string;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.UserItem commenter = 3;
     */
    commenter?: UserItem;
    /**
     * @generated from protobuf field: google.protobuf.Timestamp commentedAt = 4;
     */
    commentedAt?: Timestamp;
    /**
     * @generated from protobuf field: bool isSticky = 5;
     */
    isSticky: boolean;
    /**
     * @generated from protobuf field: wuxiaworld.api.v2.ReviewCommenterEntityInfo commenterEntityInfo = 6;
     */
    commenterEntityInfo?: ReviewCommenterEntityInfo;
}
// @generated message type with reflection information, may provide speed optimized methods
class CreateReviewCommentRequest$Type extends MessageType<CreateReviewCommentRequest> {
    constructor() {
        super("wuxiaworld.api.v2.CreateReviewCommentRequest", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "content", kind: "scalar", T: 9 /*ScalarType.STRING*/, options: { "wuxiaworld.api.v2.stringLength": { minLength: { value: 1 }, maxLength: { value: 2048 } }, "wuxiaworld.api.v2.display": { name: "Content" } } },
            { no: 3, name: "novelId", kind: "scalar", oneof: "type", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "productId", kind: "scalar", oneof: "type", T: 5 /*ScalarType.INT32*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.CreateReviewCommentRequest
 */
export const CreateReviewCommentRequest = new CreateReviewCommentRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class CreateReviewCommentsResponse$Type extends MessageType<CreateReviewCommentsResponse> {
    constructor() {
        super("wuxiaworld.api.v2.CreateReviewCommentsResponse", [
            { no: 1, name: "item", kind: "message", T: () => ReviewCommentItem }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.CreateReviewCommentsResponse
 */
export const CreateReviewCommentsResponse = new CreateReviewCommentsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetReviewCommentsRequest$Type extends MessageType<GetReviewCommentsRequest> {
    constructor() {
        super("wuxiaworld.api.v2.GetReviewCommentsRequest", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "novelId", kind: "scalar", oneof: "type", T: 5 /*ScalarType.INT32*/ },
            { no: 3, name: "productId", kind: "scalar", oneof: "type", T: 5 /*ScalarType.INT32*/ },
            { no: 4, name: "pageInfo", kind: "message", T: () => PageInfoRequest }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetReviewCommentsRequest
 */
export const GetReviewCommentsRequest = new GetReviewCommentsRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class GetReviewCommentsResponse$Type extends MessageType<GetReviewCommentsResponse> {
    constructor() {
        super("wuxiaworld.api.v2.GetReviewCommentsResponse", [
            { no: 1, name: "items", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => ReviewCommentItem },
            { no: 2, name: "pageInfo", kind: "message", T: () => PageInfoResponse, options: { "wuxiaworld.api.v2.required": { value: true } } }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.GetReviewCommentsResponse
 */
export const GetReviewCommentsResponse = new GetReviewCommentsResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ReviewCommenterSeriesInfo$Type extends MessageType<ReviewCommenterSeriesInfo> {
    constructor() {
        super("wuxiaworld.api.v2.ReviewCommenterSeriesInfo", [
            { no: 1, name: "isChampion", kind: "scalar", T: 8 /*ScalarType.BOOL*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.ReviewCommenterSeriesInfo
 */
export const ReviewCommenterSeriesInfo = new ReviewCommenterSeriesInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ReviewCommenterEntityInfo$Type extends MessageType<ReviewCommenterEntityInfo> {
    constructor() {
        super("wuxiaworld.api.v2.ReviewCommenterEntityInfo", [
            { no: 1, name: "seriesInfo", kind: "message", oneof: "entityInfo", T: () => ReviewCommenterSeriesInfo }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.ReviewCommenterEntityInfo
 */
export const ReviewCommenterEntityInfo = new ReviewCommenterEntityInfo$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ReviewCommentItem$Type extends MessageType<ReviewCommentItem> {
    constructor() {
        super("wuxiaworld.api.v2.ReviewCommentItem", [
            { no: 1, name: "id", kind: "scalar", T: 5 /*ScalarType.INT32*/ },
            { no: 2, name: "content", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 3, name: "commenter", kind: "message", T: () => UserItem },
            { no: 4, name: "commentedAt", kind: "message", T: () => Timestamp },
            { no: 5, name: "isSticky", kind: "scalar", T: 8 /*ScalarType.BOOL*/ },
            { no: 6, name: "commenterEntityInfo", kind: "message", T: () => ReviewCommenterEntityInfo }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.ReviewCommentItem
 */
export const ReviewCommentItem = new ReviewCommentItem$Type();
/**
 * @generated ServiceType for protobuf service wuxiaworld.api.v2.ReviewComments
 */
export const ReviewComments = new ServiceType("wuxiaworld.api.v2.ReviewComments", [
    { name: "CreateReviewComment", options: {}, I: CreateReviewCommentRequest, O: CreateReviewCommentsResponse },
    { name: "GetReviewComments", options: {}, I: GetReviewCommentsRequest, O: GetReviewCommentsResponse }
]);
