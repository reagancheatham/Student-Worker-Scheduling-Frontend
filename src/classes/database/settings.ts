import { DatabaseModel } from "./databaseModel.ts";

export class Settings extends DatabaseModel {
    constructor(
        public readonly businessID: number,
        public doubleTaskSignOff: boolean,
        public employeeSignOff: boolean,
        public allowClockInOut: boolean,
        public clockInThreshold: number,
        public onTimeThreshold: number,
        public automaticShiftTrades: boolean,
        public enableOpenShift: boolean,
        public enableShiftTrades: boolean,
        public defaultTermCode: string,
    ) {
        super();
    }

    public static createFromData(data: any): Settings {
        return new Settings(
            data["businessID"] ?? 1,
            data["doubleTaskSignOff"] ?? false,
            data["employeeSignOff"] ?? false,
            data["allowClockInOut"] ?? true,
            data["clockInThreshold"] ?? 5,
            data["onTimeThreshold"] ?? 15,
            data["automaticShiftTrades"] ?? false,
            data["enableOpenShift"] ?? false,
            data["enableShiftTrades"] ?? false,
            data["defaultTermCode"] ?? "2026SP",
        );
    }

    public static defaultsForBusiness(businessID: number): Settings {
        return new Settings(
            businessID,
            false,
            false,
            true,
            5,
            15,
            false,
            false,
            false,
            "2026SP",
        );
    }
}
