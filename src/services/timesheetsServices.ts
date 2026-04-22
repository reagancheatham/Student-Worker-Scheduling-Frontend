import { Timesheet } from "@classes/database/timesheet";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "timesheets";

export class TimeSheetsServices {
    //late night ai pass is why this one is weird.
    //if you wanna refactor go ahead
    static async create(timesheet: Timesheet): Promise<Timesheet> {
        const responseData = await DatabaseServices.create(
            Timesheet,
            API_ROOT,
            timesheet.toJSON(),
        );
        return Timesheet.createFromData(responseData);
    }

    static async update(timesheet: Timesheet) {
        await DatabaseServices.update(Timesheet, API_ROOT, timesheet);
    }

    static async delete(timesheet: Timesheet) {
        await DatabaseServices.delete(`${API_ROOT}/${timesheet.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<Timesheet>(
            Timesheet,
            `${API_ROOT}/${id}`,
        );
    }

    static async getAllForEmployee(employeeID: number) {
        return await DatabaseServices.getAll<Timesheet>(
            Timesheet,
            `${API_ROOT}/employee/${employeeID}`,
        )
    }
}
