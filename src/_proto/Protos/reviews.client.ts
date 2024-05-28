// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size,long_type_number,generate_dependencies
// @generated from protobuf file "Protos/reviews.proto" (package "wuxiaworld.api.v2", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Reviews } from "./reviews";
import type { SearchReviewsResponse } from "./reviews";
import type { SearchReviewsRequest } from "./reviews";
import type { GetUserReviewsResponse } from "./reviews";
import type { GetUserReviewsRequest } from "./reviews";
import type { GetUserReviewResponse } from "./reviews";
import type { GetUserReviewRequest } from "./reviews";
import type { SubmitReviewVoteResponse } from "./reviews";
import type { SubmitReviewVoteRequest } from "./reviews";
import type { UpdateReviewResponse } from "./reviews";
import type { UpdateReviewRequest } from "./reviews";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { CreateReviewResponse } from "./reviews";
import type { CreateReviewRequest } from "./reviews";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service wuxiaworld.api.v2.Reviews
 */
export interface IReviewsClient {
    /**
     * @generated from protobuf rpc: CreateReview(wuxiaworld.api.v2.CreateReviewRequest) returns (wuxiaworld.api.v2.CreateReviewResponse);
     */
    createReview(input: CreateReviewRequest, options?: RpcOptions): UnaryCall<CreateReviewRequest, CreateReviewResponse>;
    /**
     * @generated from protobuf rpc: UpdateReview(wuxiaworld.api.v2.UpdateReviewRequest) returns (wuxiaworld.api.v2.UpdateReviewResponse);
     */
    updateReview(input: UpdateReviewRequest, options?: RpcOptions): UnaryCall<UpdateReviewRequest, UpdateReviewResponse>;
    /**
     * @generated from protobuf rpc: SubmitReviewVote(wuxiaworld.api.v2.SubmitReviewVoteRequest) returns (wuxiaworld.api.v2.SubmitReviewVoteResponse);
     */
    submitReviewVote(input: SubmitReviewVoteRequest, options?: RpcOptions): UnaryCall<SubmitReviewVoteRequest, SubmitReviewVoteResponse>;
    /**
     * @generated from protobuf rpc: GetUserReview(wuxiaworld.api.v2.GetUserReviewRequest) returns (wuxiaworld.api.v2.GetUserReviewResponse);
     */
    getUserReview(input: GetUserReviewRequest, options?: RpcOptions): UnaryCall<GetUserReviewRequest, GetUserReviewResponse>;
    /**
     * @generated from protobuf rpc: GetUserReviews(wuxiaworld.api.v2.GetUserReviewsRequest) returns (wuxiaworld.api.v2.GetUserReviewsResponse);
     */
    getUserReviews(input: GetUserReviewsRequest, options?: RpcOptions): UnaryCall<GetUserReviewsRequest, GetUserReviewsResponse>;
    /**
     * @generated from protobuf rpc: SearchReviews(wuxiaworld.api.v2.SearchReviewsRequest) returns (wuxiaworld.api.v2.SearchReviewsResponse);
     */
    searchReviews(input: SearchReviewsRequest, options?: RpcOptions): UnaryCall<SearchReviewsRequest, SearchReviewsResponse>;
}
/**
 * @generated from protobuf service wuxiaworld.api.v2.Reviews
 */
export class ReviewsClient implements IReviewsClient, ServiceInfo {
    typeName = Reviews.typeName;
    methods = Reviews.methods;
    options = Reviews.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: CreateReview(wuxiaworld.api.v2.CreateReviewRequest) returns (wuxiaworld.api.v2.CreateReviewResponse);
     */
    createReview(input: CreateReviewRequest, options?: RpcOptions): UnaryCall<CreateReviewRequest, CreateReviewResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<CreateReviewRequest, CreateReviewResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpdateReview(wuxiaworld.api.v2.UpdateReviewRequest) returns (wuxiaworld.api.v2.UpdateReviewResponse);
     */
    updateReview(input: UpdateReviewRequest, options?: RpcOptions): UnaryCall<UpdateReviewRequest, UpdateReviewResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<UpdateReviewRequest, UpdateReviewResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: SubmitReviewVote(wuxiaworld.api.v2.SubmitReviewVoteRequest) returns (wuxiaworld.api.v2.SubmitReviewVoteResponse);
     */
    submitReviewVote(input: SubmitReviewVoteRequest, options?: RpcOptions): UnaryCall<SubmitReviewVoteRequest, SubmitReviewVoteResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<SubmitReviewVoteRequest, SubmitReviewVoteResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetUserReview(wuxiaworld.api.v2.GetUserReviewRequest) returns (wuxiaworld.api.v2.GetUserReviewResponse);
     */
    getUserReview(input: GetUserReviewRequest, options?: RpcOptions): UnaryCall<GetUserReviewRequest, GetUserReviewResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetUserReviewRequest, GetUserReviewResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetUserReviews(wuxiaworld.api.v2.GetUserReviewsRequest) returns (wuxiaworld.api.v2.GetUserReviewsResponse);
     */
    getUserReviews(input: GetUserReviewsRequest, options?: RpcOptions): UnaryCall<GetUserReviewsRequest, GetUserReviewsResponse> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetUserReviewsRequest, GetUserReviewsResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: SearchReviews(wuxiaworld.api.v2.SearchReviewsRequest) returns (wuxiaworld.api.v2.SearchReviewsResponse);
     */
    searchReviews(input: SearchReviewsRequest, options?: RpcOptions): UnaryCall<SearchReviewsRequest, SearchReviewsResponse> {
        const method = this.methods[5], opt = this._transport.mergeOptions(options);
        return stackIntercept<SearchReviewsRequest, SearchReviewsResponse>("unary", this._transport, method, opt, input);
    }
}