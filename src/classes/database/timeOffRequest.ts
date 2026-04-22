import { ApprovalStatus } from "@classes/util/approvalStatus.ts";
import { DatabaseModel } from "./databaseModel.ts";
import { Employee } from "./employee.ts";

export class TimeOffRequest extends DatabaseModel {
    constructor(
        public id: number,
        public employee: Employee | undefined,
        public startDate: Date,
        public endDate: Date,
        public reason: string,
        public status: ApprovalStatus,
    ) {
        super();
    }

    public static createFromData(data: any): TimeOffRequest {
        const employee = data["Employee"]
            ? Employee.createFromData(data["Employee"])
            : undefined;

        console.log("BODY: " + JSON.stringify(data));

        return new TimeOffRequest(
            data["id"] ?? 0,
            employee,
            data["startDate"] ?? Date.now(),
            data["endDate"] ?? Date.now(),
            data["reason"] ?? "",
            data["approvalStatus"] ?? ApprovalStatus.Pending,
        );
    }

    public toJSON() {
        return {
            employeeID: this.employee ? this.employee.id : null,
            startDate: this.startDate,
            endDate: this.endDate,
            reason: this.reason,
            approvalStatus: this.status,
        };
    }
}
