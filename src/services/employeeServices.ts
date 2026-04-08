import { Employee } from "@classes/database/employee";
import { DatabaseServices } from "@classes/util/databaseServices";
import { apiClient } from "./services";

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

    static async getAllForBusiness(businessID: number) {
        return await DatabaseServices.getAll<Employee>(
            Employee,
            `${API_ROOT}/business/${businessID}`,
        );
    }

    static async getAllOwners() {
        let finalResult: Object | null = null;

        await apiClient
            .get(`${API_ROOT}/owners`)
            .then((result) => {
                finalResult = result.data;
                console.log(`Fetched Owners`);
            })
            .catch((err) => {
                console.error(`Error fetching owners`);
                return null;
            });

        if (finalResult === null)
            throw Error(`Error fetching owners`);
        else return finalResult;
    }
}
