// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size,long_type_number,generate_dependencies
// @generated from protobuf file "Protos/chapters.proto" (package "wuxiaworld.api.v2", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Chapters } from "./chapters";
import type { GetLatestChaptersResponse } from "./chapters";
import type { GetLatestChaptersRequest } from "./chapters";
import type { GetChaptersBatch } from "./chapters";
import type { GetChaptersRequest } from "./chapters";
import type { ServerStreamingCall } from "@protobuf-ts/runtime-rpc";
import type { GetChapterResponse } from "./chapters";
import type { GetChapterRequest } from "./chapters";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { GetChapterListResponse } from "./chapters";
import type { GetChapterListRequest } from "./chapters";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service wuxiaworld.api.v2.Chapters
 */
export interface IChaptersClient {
    /**
     * @generated from protobuf rpc: GetChapterList(wuxiaworld.api.v2.GetChapterListRequest) returns (wuxiaworld.api.v2.GetChapterListResponse);
     */
    getChapterList(input: GetChapterListRequest, options?: RpcOptions): UnaryCall<GetChapterListRequest, GetChapterListResponse>;
    /**
     * @generated from protobuf rpc: GetChapter(wuxiaworld.api.v2.GetChapterRequest) returns (wuxiaworld.api.v2.GetChapterResponse);
     */
    getChapter(input: GetChapterRequest, options?: RpcOptions): UnaryCall<GetChapterRequest, GetChapterResponse>;
    /**
     * @generated from protobuf rpc: GetChapters(wuxiaworld.api.v2.GetChaptersRequest) returns (stream wuxiaworld.api.v2.GetChaptersBatch);
     */
    getChapters(input: GetChaptersRequest, options?: RpcOptions): ServerStreamingCall<GetChaptersRequest, GetChaptersBatch>;
    /**
     * @generated from protobuf rpc: GetLatestChapters(wuxiaworld.api.v2.GetLatestChaptersRequest) returns (wuxiaworld.api.v2.GetLatestChaptersResponse);
     */
    getLatestChapters(input: GetLatestChaptersRequest, options?: RpcOptions): UnaryCall<GetLatestChaptersRequest, GetLatestChaptersResponse>;
}
/**
 * @generated from protobuf service wuxiaworld.api.v2.Chapters
 */
export class ChaptersClient implements IChaptersClient, ServiceInfo {
    typeName = Chapters.typeName;
    methods = Chapters.methods;
    options = Chapters.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: GetChapterList(wuxiaworld.api.v2.GetChapterListRequest) returns (wuxiaworld.api.v2.GetChapterListResponse);
     */
    getChapterList(input: GetChapterListRequest, options?: RpcOptions): UnaryCall<GetChapterListRequest, GetChapterListResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetChapterListRequest, GetChapterListResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetChapter(wuxiaworld.api.v2.GetChapterRequest) returns (wuxiaworld.api.v2.GetChapterResponse);
     */
    getChapter(input: GetChapterRequest, options?: RpcOptions): UnaryCall<GetChapterRequest, GetChapterResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetChapterRequest, GetChapterResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetChapters(wuxiaworld.api.v2.GetChaptersRequest) returns (stream wuxiaworld.api.v2.GetChaptersBatch);
     */
    getChapters(input: GetChaptersRequest, options?: RpcOptions): ServerStreamingCall<GetChaptersRequest, GetChaptersBatch> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetChaptersRequest, GetChaptersBatch>("serverStreaming", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetLatestChapters(wuxiaworld.api.v2.GetLatestChaptersRequest) returns (wuxiaworld.api.v2.GetLatestChaptersResponse);
     */
    getLatestChapters(input: GetLatestChaptersRequest, options?: RpcOptions): UnaryCall<GetLatestChaptersRequest, GetLatestChaptersResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetLatestChaptersRequest, GetLatestChaptersResponse>("unary", this._transport, method, opt, input);
    }
}
