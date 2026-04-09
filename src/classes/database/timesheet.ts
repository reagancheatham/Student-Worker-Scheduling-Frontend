import { DatabaseModel } from "./databaseModel";

export class Timesheet extends DatabaseModel {
    public constructor(
        public readonly id: number = 0,
        public readonly shiftID: number,
        public clockIn: Date | undefined = undefined,
        public clockOut: Date | undefined = undefined,
    ) {
        super();
    }

    public static createFromData(data: any): Timesheet {
        return new Timesheet(
            data["id"] ?? 0,
            data["shiftID"] ?? 0,
            data["clockIn"] ? new Date(data["clockIn"]) : undefined,
            data["clockOut"] ? new Date(data["clockOut"]) : undefined,
        );
    }

    public toJSON(): object {
        const payload: any = {
            shiftID: this.shiftID,
            clockIn: this.clockIn ? this.clockIn.toISOString() : null,
        };
        if (this.clockOut) {
            payload.clockOut = this.clockOut.toISOString();
        }
        if (this.id > 0) {
            payload.id = this.id;
        }
        return payload;
    }
}
