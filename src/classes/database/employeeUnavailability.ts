import { DatabaseModel } from "./databaseModel.ts";
import { Employee } from "./employee.ts";

export class EmployeeUnavailability extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description: string,
        public readonly startTime: Date,
        public readonly endTime: Date,
        public readonly employee: Employee,
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
        const employee = data["Employee"]
            ? Employee.create(data["Employee"])
            : undefined;

        if (!employee)
            throw Error(
                `Could not fetch employee from data: ${JSON.stringify(data)}`,
            );

        return new EmployeeUnavailability(
            data["id"] ?? 0,
            data["name"] ?? "Employee Unavailability",
            data["description"] ?? "",
            startTime,
            endTime,
            employee,
        );
    }

    public isValid(): boolean {
        return this.id > 0;
    }
}
