import { Business } from "@classes/database/business.ts";
import { apiClient } from "./services.ts";
import { User } from "@classes/database/user.ts";
import { DatabaseServices } from "@classes/util/databaseServices.ts";
import { UserClass } from "@classes/database/userClass.ts";
import { Employee } from "@classes/database/employee.ts";

const API_ROOT: string = "userClasses";

export class UserClassServices {
    public static async importAllSchedules(termCode: string) {
        console.log(`Importing student schedules for term: ${termCode}`);

        try {
            return await apiClient.post(`${API_ROOT}/import`, { termCode });
        } catch (error: any) {
            console.error(`Error importing student schedules: ${error}`);
        }
    }

    public static async importSchedulesForBusiness(
        business: Business,
        termCode: string,
    ) {
        console.log(
            `Importing student schedules for business: ${business.name} and term: ${termCode}`,
        );

        try {
            const body = {
                businessID: business.id,
                termCode,
            };

            return await apiClient.post(`${API_ROOT}/import/business`, body);
        } catch (error: any) {
            console.error(`Error importing student schedules: ${error}`);
        }
    }

    public static async getAllClassesForUser(user: User) {
        return DatabaseServices.getAll<UserClass>(
            UserClass,
            `${API_ROOT}/user/${user.id}`,
        );
    }

    public static async getAllClassesForBusiness(business: Business) {
        return DatabaseServices.getAll<UserClass>(
            UserClass,
            `${API_ROOT}/business/${business.id}`,
        );
    }

    public static async getAllClassesForEmployee(employee: Employee) {
        return DatabaseServices.getAll<UserClass>(
            UserClass,
            `${API_ROOT}/employee/${employee.id}`,
        );
    }
}
