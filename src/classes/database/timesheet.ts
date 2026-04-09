import { DatabaseModel } from "./databaseModel";

export class Timesheet extends DatabaseModel {
    public constructor(
        public readonly id: number,
        public readonly shiftID: number,
        public clockIn: Date,
        public clockOut: Date,
    ) {
        super();
    }

    public createFromData(data: any): Timesheet {
        let;
    }
}
