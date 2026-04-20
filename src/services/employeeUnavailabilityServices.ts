import { apiClient } from "./services";

const API_ROOT: string = "employeeUnavailabilities";

export class EmployeeUnavailabilityServices {
    public static async importStudentSchedulesForBusiness(
        businessID: number,
        termCode: string,
    ) {
        return await apiClient.post(
            `${API_ROOT}/import/studentSchedules`,
            {
                businessID,
                termCode,
            },
        );
    }

    public static async importStudentScheduleForEmployee(
        employeeID: number,
        termCode: string,
    ) {
        return await apiClient.post(
            `${API_ROOT}/import/studentSchedules/employee/${employeeID}`,
            {
                termCode,
            },
        );
    }
}
