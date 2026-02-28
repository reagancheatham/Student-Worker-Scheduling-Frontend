import { DatabaseModel } from "./databaseModel.ts";

export class Shift extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly businessID: number,
        public readonly employeeID: number,
        public readonly name: string,
        public readonly startTime: Date,
        public readonly endTime: Date,
    ) {
        super();
    }

    protected static createFromData(data: object): Shift {
        return new Shift(
            data["id"] ?? 0,
            data["businessID"] ?? 0,
            data["employeeID"] ?? 0,
            data["name"] ?? 0,
            data["startTime"] ?? Date.now(),
            data["endTime"] ?? Date.now(),
        );
    }
}
