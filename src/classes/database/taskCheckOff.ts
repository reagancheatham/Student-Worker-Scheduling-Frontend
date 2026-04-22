import { DatabaseModel } from "./databaseModel.ts";
import { Employee } from "./employee.ts";

export class TaskCheckOff extends DatabaseModel {
    public constructor(
        public id: number,
        readonly taskID: number,
        readonly employee: Employee,
    ) {
        super();
    }

    public static createFromData(data: any): TaskCheckOff {
        const employeeData = data["Employee"];

        return new TaskCheckOff(
            data["id"] ?? 0,
            data["taskID"] ?? 0,
            employeeData
                ? Employee.createFromData(employeeData)
                : new Employee(0, 0, 0, "", "", "", "", ""),
        );
    }

    public toJSON() {
        return {
            id: this.id,
            taskID: this.taskID,
            sourceEmployeeID: this.employee.id,
        };
    }
}
