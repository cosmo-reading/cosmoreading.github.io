// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size,long_type_number,generate_dependencies
// @generated from protobuf file "Protos/novels.proto" (package "wuxiaworld.api.v2", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Novels } from "./novels";
import type { GetSponsorNovelsResponse } from "./novels";
import type { GetSponsorNovelsRequest } from "./novels";
import type { GetNovelsResponse } from "./novels";
import type { GetNovelsRequest } from "./novels";
import type { GetNovelResponse } from "./novels";
import type { GetNovelRequest } from "./novels";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { SearchNovelsResponse } from "./novels";
import type { SearchNovelsRequest } from "./novels";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service wuxiaworld.api.v2.Novels
 */
export interface INovelsClient {
    /**
     * @generated from protobuf rpc: SearchNovels(wuxiaworld.api.v2.SearchNovelsRequest) returns (wuxiaworld.api.v2.SearchNovelsResponse);
     */
    searchNovels(input: SearchNovelsRequest, options?: RpcOptions): UnaryCall<SearchNovelsRequest, SearchNovelsResponse>;
    /**
     * @generated from protobuf rpc: GetNovel(wuxiaworld.api.v2.GetNovelRequest) returns (wuxiaworld.api.v2.GetNovelResponse);
     */
    getNovel(input: GetNovelRequest, options?: RpcOptions): UnaryCall<GetNovelRequest, GetNovelResponse>;
    /**
     * @generated from protobuf rpc: GetNovels(wuxiaworld.api.v2.GetNovelsRequest) returns (wuxiaworld.api.v2.GetNovelsResponse);
     */
    getNovels(input: GetNovelsRequest, options?: RpcOptions): UnaryCall<GetNovelsRequest, GetNovelsResponse>;
    /**
     * @generated from protobuf rpc: GetSponsorNovels(wuxiaworld.api.v2.GetSponsorNovelsRequest) returns (wuxiaworld.api.v2.GetSponsorNovelsResponse);
     */
    getSponsorNovels(input: GetSponsorNovelsRequest, options?: RpcOptions): UnaryCall<GetSponsorNovelsRequest, GetSponsorNovelsResponse>;
}
/**
 * @generated from protobuf service wuxiaworld.api.v2.Novels
 */
export class NovelsClient implements INovelsClient, ServiceInfo {
    typeName = Novels.typeName;
    methods = Novels.methods;
    options = Novels.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: SearchNovels(wuxiaworld.api.v2.SearchNovelsRequest) returns (wuxiaworld.api.v2.SearchNovelsResponse);
     */
    searchNovels(input: SearchNovelsRequest, options?: RpcOptions): UnaryCall<SearchNovelsRequest, SearchNovelsResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<SearchNovelsRequest, SearchNovelsResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetNovel(wuxiaworld.api.v2.GetNovelRequest) returns (wuxiaworld.api.v2.GetNovelResponse);
     */
    getNovel(input: GetNovelRequest, options?: RpcOptions): UnaryCall<GetNovelRequest, GetNovelResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetNovelRequest, GetNovelResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetNovels(wuxiaworld.api.v2.GetNovelsRequest) returns (wuxiaworld.api.v2.GetNovelsResponse);
     */
    getNovels(input: GetNovelsRequest, options?: RpcOptions): UnaryCall<GetNovelsRequest, GetNovelsResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetNovelsRequest, GetNovelsResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetSponsorNovels(wuxiaworld.api.v2.GetSponsorNovelsRequest) returns (wuxiaworld.api.v2.GetSponsorNovelsResponse);
     */
    getSponsorNovels(input: GetSponsorNovelsRequest, options?: RpcOptions): UnaryCall<GetSponsorNovelsRequest, GetSponsorNovelsResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetSponsorNovelsRequest, GetSponsorNovelsResponse>("unary", this._transport, method, opt, input);
    }
}