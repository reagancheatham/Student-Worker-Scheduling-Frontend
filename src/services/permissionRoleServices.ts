import { PermissionRole } from "@classes/database/permissionRole";
import { DatabaseServices } from "@classes/util/databaseServices.ts";

const API_ROOT: string = "permissionRoles";

export class PermissionRoleServices {
    static async get(id: number) {
        return await DatabaseServices.get<PermissionRole>(PermissionRole, `${API_ROOT}/${id}`);
    }
}
