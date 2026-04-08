import { Employee } from "@classes/database/employee";
import { DatabaseServices } from "@classes/util/databaseServices";
import { apiClient } from "./services";
import { Owner } from "@classes/database/owner.ts";
import { Business } from "@classes/database/business.ts";

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
        let owners: Owner[] = [];

        try {
            const result = await apiClient.get(`${API_ROOT}/owners`);

            owners = result.data.map((ownerData: any) => {
                console.log("outer data: " + JSON.stringify(ownerData));
                return new Owner(
                    Employee.createFromData(ownerData),
                    Business.createFromData(ownerData["Business"]),
                );
            });

            return owners;
        } catch (error) {
            console.error(`Error fetching owners: ${error}`);
            return owners;
        }
    }
}
