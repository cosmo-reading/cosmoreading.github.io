// @generated by protobuf-ts 2.9.4 with parameter optimize_code_size,long_type_number,generate_dependencies
// @generated from protobuf file "Protos/roles.proto" (package "wuxiaworld.api.v2", syntax proto3)
// tslint:disable
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message wuxiaworld.api.v2.Role
 */
export interface Role {
    /**
     * @generated from protobuf field: string name = 1;
     */
    name: string;
}
// @generated message type with reflection information, may provide speed optimized methods
class Role$Type extends MessageType<Role> {
    constructor() {
        super("wuxiaworld.api.v2.Role", [
            { no: 1, name: "name", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
}
/**
 * @generated MessageType for protobuf message wuxiaworld.api.v2.Role
 */
export const Role = new Role$Type();
