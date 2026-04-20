import { Employee } from "@classes/database/employee.ts";
import { EmployeeRole } from "@classes/database/employeeRole.ts";
import { Role } from "@classes/database/role.ts";
import { DatabaseServices } from "@classes/util/databaseServices.ts";

const API_ROOT: string = "roles";

export class RoleServices {
    public static async create(role: Role) {
        return await DatabaseServices.create<Role>(Role, API_ROOT, role);
    }

    public static async update(role: Role) {
        return await DatabaseServices.update<Role>(Role, API_ROOT, role);
    }

    public static async delete(role: Role) {
        return await DatabaseServices.delete(`${API_ROOT}/${role.id}`);
    }

    public static async get(id: number) {
        return await DatabaseServices.get<Role>(Role, `${API_ROOT}/${id}`);
    }

    public static async getAllForBusiness(businessID: number) {
        return await DatabaseServices.getAll<Role>(
            Role,
            `${API_ROOT}/business/${businessID}`,
        );
    }

    public static async addRoleToEmployee(role: Role, employee: Employee) {
        return await DatabaseServices.create<EmployeeRole>(
            EmployeeRole,
            "employeeRoles",
            EmployeeRole.createFromObjects(role, employee),
        );
    }

    public static async deleteRoleFromEmployee(role: Role, employee: Employee) {
        return await DatabaseServices.delete(
            `employeeRoles/employee/${employee.id}/role/${role.id}`,
        );
    }
}
