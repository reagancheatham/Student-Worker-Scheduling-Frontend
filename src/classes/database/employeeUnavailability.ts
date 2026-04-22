import { DatabaseModel } from "./databaseModel.ts";

export class EmployeeUnavailability extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly employeeID: number,
        public readonly name: string,
        public readonly description: string,
        public readonly startTime: Date,
        public readonly endTime: Date,
    ) {
        super();
    }

    public static createFromData(data: any): EmployeeUnavailability {
        const startTime = data["startTime"] 
        ? new Date(data["startTime"])
        : new Date();
        const endTime = data["endTime"] 
        ? new Date(data["endTime"])
        : new Date();

        return new EmployeeUnavailability(
            data["id"] ?? 0,
            data["employeeID"] ?? 0,
            data["name"] ?? "Employee Unavailability",
            data["description"] ?? "",
            startTime,
            endTime
        );
    }
}
