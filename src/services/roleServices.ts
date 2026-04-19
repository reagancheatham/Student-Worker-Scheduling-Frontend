import { Role } from "@classes/database/role.ts";
import { DatabaseServices } from "@classes/util/databaseServices.ts";

const API_ROOT: string = "roles";

export class RoleServices {
    static async create(role: Role) {
        return await DatabaseServices.create<Role>(Role, API_ROOT, role);
    }

    static async update(role: Role) {
        return await DatabaseServices.update<Role>(Role, API_ROOT, role);
    }

    static async delete(role: Role) {
        return await DatabaseServices.delete(`${API_ROOT}/${role.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<Role>(Role, `${API_ROOT}/${id}`);
    }

    static async getAllForBusiness(businessID: number) {
        return await DatabaseServices.getAll<Role>(
            Role,
            `${API_ROOT}/business/${businessID}`,
        );
    }
}
