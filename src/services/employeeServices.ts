import { Employee } from "@classes/database/employee";
import { DatabaseServices } from "@classes/util/databaseServices";
import { apiClient } from "./services";
import { Owner } from "@classes/database/owner.ts";
import { Business } from "@classes/database/business.ts";
import { User } from "@classes/database/user.ts";
import { Store } from "@classes/util/store/store";

const API_ROOT: string = "employees";

export class EmployeeServices {
    public static async create(employee: Employee) {
        try {
            let business = await Store.businessStore.get();
            if (business) await apiClient.post(`${API_ROOT}`, employee);
        } catch (error) {
            console.error(`Error adding employee: ${error}`);
            return;
        }
    }

    public static async update(employee: Employee) {
        await DatabaseServices.update(Employee, API_ROOT, employee);
    }

    public static async delete(employee: Employee) {
        await DatabaseServices.delete(`${API_ROOT}/${employee.id}`);
    }

    public static async get(id: number) {
        return await DatabaseServices.get<Employee>(
            Employee,
            `${API_ROOT}/${id}`,
        );
    }

    public static async getAllForBusiness(businessID: number) {
        return await DatabaseServices.getAll<Employee>(
            Employee,
            `${API_ROOT}/business/${businessID}`,
        );
    }

    public static async getAllOwners() {
        let owners: Owner[] = [];

        try {
            const result = await apiClient.get(`${API_ROOT}/owners`);
            owners = result.data.map((ownerData: any) => {
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

    public static async getEmployeeForUserAndBusiness(
        user: User,
        business: Business,
    ): Promise<Employee | undefined> {
        try {
            const employee = DatabaseServices.get<Employee>(
                Employee,
                `${API_ROOT}/user/${user.id}/business/${business.id}`,
            );

            return employee;
        } catch (error: any) {
            console.error(`Error fetching employee: ${error}`);
        }
    }
}
