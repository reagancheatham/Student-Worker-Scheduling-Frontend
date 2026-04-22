import { DatabaseModel } from "./databaseModel";
import { Shift } from "./shift";

export class Timesheet extends DatabaseModel {
    public constructor(
        public readonly id: number = 0,
        public readonly shift: Shift,
        public clockIn: Date | undefined = undefined,
        public clockOut: Date | undefined = undefined,
    ) {
        super();
    }

    public static createFromData(data: any): Timesheet {
        return new Timesheet(
            data["id"] ?? 0,
            Shift.createFromData(data["Shift"]) ?? null,
            data["clockIn"] ? new Date(data["clockIn"]) : undefined,
            data["clockOut"] ? new Date(data["clockOut"]) : undefined,
        );
    }
}
