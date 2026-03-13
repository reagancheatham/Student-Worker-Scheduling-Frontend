import { Employee } from "@classes/database/employee";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "employees";

export class EmployeeServices {
    static async create(employee: Employee) {
        await DatabaseServices.create(Employee, API_ROOT, employee);
    }

    static async update(employee: Employee) {
        await DatabaseServices.update(Employee, API_ROOT, employee);
    }

    static async delete(employee: Employee) {
        await DatabaseServices.delete(`${API_ROOT}/${employee.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<Employee>(
            Employee,
            `${API_ROOT}/${id}`,
        );
    }

    static async getForUser(userID: number) {
        return await DatabaseServices.get<Employee>(
            Employee,
            `${API_ROOT}/user/${userID}`,
        );
    }

    static async getAllForBusiness(businessID: number) {
        return await DatabaseServices.getAll<Employee>(
            Employee,
            `${API_ROOT}/business/${businessID}`,
        );
    }
}
