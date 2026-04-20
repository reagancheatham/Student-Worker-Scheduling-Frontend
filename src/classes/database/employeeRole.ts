import { DatabaseModel } from "./databaseModel.ts";
import { Employee } from "./employee.ts";
import { Role } from "./role.ts";

export class EmployeeRole extends DatabaseModel {
    constructor(
        public readonly id: number,
        public roleID: number,
        public employeeID: number,
    ) {
        super();
    }

    public static createFromObjects(
        role: Role,
        employee: Employee,
    ): EmployeeRole {
        return new EmployeeRole(0, role.id, employee.id);
    }

    public static createFromData(data: any): EmployeeRole {
        return new EmployeeRole(
            data["id"] ?? 0,
            data["roleID"] ?? 0,
            data["employeeID"] ?? 0,
        );
    }
}
