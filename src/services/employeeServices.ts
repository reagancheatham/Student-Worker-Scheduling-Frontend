import { Employee } from "@classes/Employee";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "employee";

export class EmployeeServices {
    static async create(employee: Employee) {
        await DatabaseServices.create(API_ROOT, employee);
    }

    static async update(employee: Employee) {
        await DatabaseServices.update(API_ROOT, employee);
    }

    static async delete(employee: Employee) {
        await DatabaseServices.delete(`${API_ROOT}/:${employee.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<Employee>(`${API_ROOT}/:${id}`);
    }

    static async getAllForBusiness(businessID: number) {
        return await DatabaseServices.get<Employee[]>(
            `${API_ROOT}/business/:${businessID}`,
        );
    }
}
