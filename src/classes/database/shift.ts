import { DatabaseModel } from "./databaseModel.ts";

export class Shift extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly businessID: number,
        public readonly employeeID: number,
        public name: string,
        public startTime: Date,
        public endTime: Date,
    ) {
        super();
    }

    protected static createFromData(data: any): Shift {
        const startTime = data["startTime"]
            ? new Date(data["startTime"])
            : new Date();
        const endTime = data["endTime"]
            ? new Date(data["endTime"])
            : new Date();

        return new Shift(
            data["id"] ?? 0,
            data["businessID"] ?? 0,
            data["employeeID"] ?? 0,
            data["name"] ?? 0,
            startTime,
            endTime,
        );
    }
}
