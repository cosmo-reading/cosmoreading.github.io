// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size,long_type_number,generate_dependencies
// @generated from protobuf file "Protos/billing.proto" (package "wuxiaworld.api.v2", syntax proto3)
// tslint:disable
import type { RpcTransport } from "@protobuf-ts/runtime-rpc";
import type { ServiceInfo } from "@protobuf-ts/runtime-rpc";
import { Billing } from "./billing";
import type { GetGatewayTokenResponse } from "./billing";
import type { GetGatewayTokenRequest } from "./billing";
import type { SetDefaultPaymentMethodResponse } from "./billing";
import type { SetDefaultPaymentMethodRequest } from "./billing";
import type { DeletePaymentMethodResponse } from "./billing";
import type { DeletePaymentMethodRequest } from "./billing";
import type { AddPaymentMethodResponse } from "./billing";
import type { AddPaymentMethodRequest } from "./billing";
import type { GetPaymentMethodResponse } from "./billing";
import type { GetPaymentMethodRequest } from "./billing";
import { stackIntercept } from "@protobuf-ts/runtime-rpc";
import type { GetPaymentMethodsResponse } from "./billing";
import type { Empty } from "../google/protobuf/empty";
import type { UnaryCall } from "@protobuf-ts/runtime-rpc";
import type { RpcOptions } from "@protobuf-ts/runtime-rpc";
/**
 * @generated from protobuf service wuxiaworld.api.v2.Billing
 */
export interface IBillingClient {
    /**
     * @generated from protobuf rpc: GetPaymentMethods(google.protobuf.Empty) returns (wuxiaworld.api.v2.GetPaymentMethodsResponse);
     */
    getPaymentMethods(input: Empty, options?: RpcOptions): UnaryCall<Empty, GetPaymentMethodsResponse>;
    /**
     * @generated from protobuf rpc: GetPaymentMethod(wuxiaworld.api.v2.GetPaymentMethodRequest) returns (wuxiaworld.api.v2.GetPaymentMethodResponse);
     */
    getPaymentMethod(input: GetPaymentMethodRequest, options?: RpcOptions): UnaryCall<GetPaymentMethodRequest, GetPaymentMethodResponse>;
    /**
     * @generated from protobuf rpc: AddPaymentMethod(wuxiaworld.api.v2.AddPaymentMethodRequest) returns (wuxiaworld.api.v2.AddPaymentMethodResponse);
     */
    addPaymentMethod(input: AddPaymentMethodRequest, options?: RpcOptions): UnaryCall<AddPaymentMethodRequest, AddPaymentMethodResponse>;
    /**
     * @generated from protobuf rpc: DeletePaymentMethod(wuxiaworld.api.v2.DeletePaymentMethodRequest) returns (wuxiaworld.api.v2.DeletePaymentMethodResponse);
     */
    deletePaymentMethod(input: DeletePaymentMethodRequest, options?: RpcOptions): UnaryCall<DeletePaymentMethodRequest, DeletePaymentMethodResponse>;
    /**
     * @generated from protobuf rpc: SetDefaultPaymentMethod(wuxiaworld.api.v2.SetDefaultPaymentMethodRequest) returns (wuxiaworld.api.v2.SetDefaultPaymentMethodResponse);
     */
    setDefaultPaymentMethod(input: SetDefaultPaymentMethodRequest, options?: RpcOptions): UnaryCall<SetDefaultPaymentMethodRequest, SetDefaultPaymentMethodResponse>;
    /**
     * @generated from protobuf rpc: GetGatewayToken(wuxiaworld.api.v2.GetGatewayTokenRequest) returns (wuxiaworld.api.v2.GetGatewayTokenResponse);
     */
    getGatewayToken(input: GetGatewayTokenRequest, options?: RpcOptions): UnaryCall<GetGatewayTokenRequest, GetGatewayTokenResponse>;
}
/**
 * @generated from protobuf service wuxiaworld.api.v2.Billing
 */
export class BillingClient implements IBillingClient, ServiceInfo {
    typeName = Billing.typeName;
    methods = Billing.methods;
    options = Billing.options;
    constructor(private readonly _transport: RpcTransport) {
    }
    /**
     * @generated from protobuf rpc: GetPaymentMethods(google.protobuf.Empty) returns (wuxiaworld.api.v2.GetPaymentMethodsResponse);
     */
    getPaymentMethods(input: Empty, options?: RpcOptions): UnaryCall<Empty, GetPaymentMethodsResponse> {
        const method = this.methods[0], opt = this._transport.mergeOptions(options);
        return stackIntercept<Empty, GetPaymentMethodsResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetPaymentMethod(wuxiaworld.api.v2.GetPaymentMethodRequest) returns (wuxiaworld.api.v2.GetPaymentMethodResponse);
     */
    getPaymentMethod(input: GetPaymentMethodRequest, options?: RpcOptions): UnaryCall<GetPaymentMethodRequest, GetPaymentMethodResponse> {
        const method = this.methods[1], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetPaymentMethodRequest, GetPaymentMethodResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: AddPaymentMethod(wuxiaworld.api.v2.AddPaymentMethodRequest) returns (wuxiaworld.api.v2.AddPaymentMethodResponse);
     */
    addPaymentMethod(input: AddPaymentMethodRequest, options?: RpcOptions): UnaryCall<AddPaymentMethodRequest, AddPaymentMethodResponse> {
        const method = this.methods[2], opt = this._transport.mergeOptions(options);
        return stackIntercept<AddPaymentMethodRequest, AddPaymentMethodResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: DeletePaymentMethod(wuxiaworld.api.v2.DeletePaymentMethodRequest) returns (wuxiaworld.api.v2.DeletePaymentMethodResponse);
     */
    deletePaymentMethod(input: DeletePaymentMethodRequest, options?: RpcOptions): UnaryCall<DeletePaymentMethodRequest, DeletePaymentMethodResponse> {
        const method = this.methods[3], opt = this._transport.mergeOptions(options);
        return stackIntercept<DeletePaymentMethodRequest, DeletePaymentMethodResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: SetDefaultPaymentMethod(wuxiaworld.api.v2.SetDefaultPaymentMethodRequest) returns (wuxiaworld.api.v2.SetDefaultPaymentMethodResponse);
     */
    setDefaultPaymentMethod(input: SetDefaultPaymentMethodRequest, options?: RpcOptions): UnaryCall<SetDefaultPaymentMethodRequest, SetDefaultPaymentMethodResponse> {
        const method = this.methods[4], opt = this._transport.mergeOptions(options);
        return stackIntercept<SetDefaultPaymentMethodRequest, SetDefaultPaymentMethodResponse>("unary", this._transport, method, opt, input);
    }
    /**
     * @generated from protobuf rpc: GetGatewayToken(wuxiaworld.api.v2.GetGatewayTokenRequest) returns (wuxiaworld.api.v2.GetGatewayTokenResponse);
     */
    getGatewayToken(input: GetGatewayTokenRequest, options?: RpcOptions): UnaryCall<GetGatewayTokenRequest, GetGatewayTokenResponse> {
        const method = this.methods[5], opt = this._transport.mergeOptions(options);
        return stackIntercept<GetGatewayTokenRequest, GetGatewayTokenResponse>("unary", this._transport, method, opt, input);
    }
}