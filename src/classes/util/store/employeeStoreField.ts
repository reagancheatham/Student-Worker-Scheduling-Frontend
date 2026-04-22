import { Employee } from "@classes/database/employee.ts";
import { StoreField } from "./storeField.ts";
import { Store } from "./store.ts";
import { EmployeeServices } from "../../../services/employeeServices.ts";

const STORE_KEY = "employee";

export class EmployeeStoreField extends StoreField<Employee> {
    public async get(): Promise<Employee | undefined> {
        const storedEmployee = localStorage.getItem(STORE_KEY);

        if (storedEmployee) {
            try {
                return Employee.createFromData(JSON.parse(storedEmployee));
            } catch (error: any) {
                console.error(`Error retrieving employee: ${error}`);
                return undefined;
            }
        } else {
            try {
                const user = await Store.userStore.get();
                const business = await Store.businessStore.get();

                if (!user) return undefined;
                if (!business) return undefined;

                const employee = await EmployeeServices.getEmployeeForUserAndBusiness(user, business)

                if (!employee) return undefined;

                Store.employeeStore.set(employee);
                return employee;
            } catch (error: any) {
                console.error(`Error retrieving employee for user: ${error}`);

                return undefined;
            }
        }
    }

    public set(value: Employee): void {
        localStorage.setItem(STORE_KEY, JSON.stringify(value));
    }

    public clear(): void {
        localStorage.removeItem(STORE_KEY);
    }
}
