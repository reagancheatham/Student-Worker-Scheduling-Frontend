import { Business } from "@classes/database/business.ts";
import { DatabaseServices } from "@classes/util/databaseServices.ts";
import { EmployeeUnavailability } from "@classes/database/employeeUnavailability.ts";
import { Employee } from "@classes/database/employee.ts";

const API_ROOT: string = "employeeUnavailabilities";

export class EmployeeUnavailabilityServices {
    public static async getAllForBusiness(business: Business) {
        return await DatabaseServices.getAll(
            EmployeeUnavailability,
            `${API_ROOT}/business/${business.id}`,
        );
    }

    public static async getAllForEmployee(employee: Employee) {
        return await DatabaseServices.getAll(
            EmployeeUnavailability,
            `${API_ROOT}/employee/${employee.id}`,
        );
    }
}
