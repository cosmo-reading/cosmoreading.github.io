// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size,long_type_number,generate_dependencies
// @generated from protobuf file "Protos/users.proto" (package "wuxiaworld.api.v2", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Users } from "./users";
import type { DeleteAccountResponse } from "./users";
import type { DeleteAccountRequest } from "./users";
import type { SetAvatarChunkedRequest } from "./users";
import type { ClientStreamingCall } from "@protobuf-ts/runtime-rpc";
import type { StringValue } from "../google/protobuf/wrappers";
import type { SetAvatarRequest } from "./users";
import type { UpdateUserSettingsRequest } from "./users";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { GetMyUserResponse } from "./users";
import type { Empty } from "../google/protobuf/empty";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service wuxiaworld.api.v2.Users
 */
export interface IUsersClient {
    /**
     * @generated from protobuf rpc: GetMyUser(google.protobuf.Empty) returns (wuxiaworld.api.v2.GetMyUserResponse);
     */
    getMyUser(input: Empty, options?: RpcOptions): UnaryCall<Empty, GetMyUserResponse>;
    /**
     * @generated from protobuf rpc: UpdateUserSettings(wuxiaworld.api.v2.UpdateUserSettingsRequest) returns (google.protobuf.Empty);
     */
    updateUserSettings(input: UpdateUserSettingsRequest, options?: RpcOptions): UnaryCall<UpdateUserSettingsRequest, Empty>;
    /**
     * @generated from protobuf rpc: SetAvatar(wuxiaworld.api.v2.SetAvatarRequest) returns (google.protobuf.StringValue);
     */
    setAvatar(input: SetAvatarRequest, options?: RpcOptions): UnaryCall<SetAvatarRequest, StringValue>;
    /**
     * @generated from protobuf rpc: SetAvatarChunked(stream wuxiaworld.api.v2.SetAvatarChunkedRequest) returns (google.protobuf.Empty);
     */
    setAvatarChunked(options?: RpcOptions): ClientStreamingCall<SetAvatarChunkedRequest, Empty>;
    /**
     * @generated from protobuf rpc: DeleteAvatar(google.protobuf.Empty) returns (google.protobuf.Empty);
     */
    deleteAvatar(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty>;
    /**
     * @generated from protobuf rpc: DeleteAccount(wuxiaworld.api.v2.DeleteAccountRequest) returns (wuxiaworld.api.v2.DeleteAccountResponse);
     */
    deleteAccount(input: DeleteAccountRequest, options?: RpcOptions): UnaryCall<DeleteAccountRequest, DeleteAccountResponse>;
}
/**
 * @generated from protobuf service wuxiaworld.api.v2.Users
 */
export class UsersClient implements IUsersClient, ServiceInfo {
    typeName = Users.typeName;
    methods = Users.methods;
    options = Users.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: GetMyUser(google.protobuf.Empty) returns (wuxiaworld.api.v2.GetMyUserResponse);
     */
    getMyUser(input: Empty, options?: RpcOptions): UnaryCall<Empty, GetMyUserResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, GetMyUserResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: UpdateUserSettings(wuxiaworld.api.v2.UpdateUserSettingsRequest) returns (google.protobuf.Empty);
     */
    updateUserSettings(input: UpdateUserSettingsRequest, options?: RpcOptions): UnaryCall<UpdateUserSettingsRequest, Empty> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<UpdateUserSettingsRequest, Empty>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: SetAvatar(wuxiaworld.api.v2.SetAvatarRequest) returns (google.protobuf.StringValue);
     */
    setAvatar(input: SetAvatarRequest, options?: RpcOptions): UnaryCall<SetAvatarRequest, StringValue> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<SetAvatarRequest, StringValue>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: SetAvatarChunked(stream wuxiaworld.api.v2.SetAvatarChunkedRequest) returns (google.protobuf.Empty);
     */
    setAvatarChunked(options?: RpcOptions): ClientStreamingCall<SetAvatarChunkedRequest, Empty> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<SetAvatarChunkedRequest, Empty>("clientStreaming", this._transport, method, opt);
    }
    /**
     * @generated from protobuf rpc: DeleteAvatar(google.protobuf.Empty) returns (google.protobuf.Empty);
     */
    deleteAvatar(input: Empty, options?: RpcOptions): UnaryCall<Empty, Empty> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, Empty>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DeleteAccount(wuxiaworld.api.v2.DeleteAccountRequest) returns (wuxiaworld.api.v2.DeleteAccountResponse);
     */
    deleteAccount(input: DeleteAccountRequest, options?: RpcOptions): UnaryCall<DeleteAccountRequest, DeleteAccountResponse> {
        const method = this.methods[5], opt = this._transport.mergeOptions(options);
        return stackIntercept<DeleteAccountRequest, DeleteAccountResponse>("unary", this._transport, method, opt, input);
    }
}
