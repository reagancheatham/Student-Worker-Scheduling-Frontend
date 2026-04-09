import { Timesheet } from "@classes/database/timesheet";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "timesheets";

export class TimeSheetsServices {
    // static async create(timesheet: Timesheet) {
    //     await DatabaseServices.create(Timesheet, API_ROOT, timesheet);
    // }

    static async create(timesheet: Timesheet): Promise<Timesheet> {
        const responseData = await DatabaseServices.create(
            Timesheet,
            API_ROOT,
            timesheet.toJSON(), // use toJSON()
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
}
