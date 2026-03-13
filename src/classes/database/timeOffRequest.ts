import { ApprovalStatus } from "@classes/util/approvalStatus.ts";
import { DatabaseModel } from "./databaseModel.ts";
import { Employee } from "./employee.ts";

export class TimeOffRequest extends DatabaseModel {
    constructor(
        public id: number,
        public employee: Employee,
        public startDate: Date,
        public endDate: Date,
        public reason: string,
        public status: ApprovalStatus,
    ) {
        super();
    }

    public static createFromData(data: any): TimeOffRequest {
        return new TimeOffRequest(
            data["id"] ?? 0,
            Employee.createFromData(data["Employee"]) ?? null,
            data["startDate"] ?? Date.now(),
            data["endDate"] ?? Date.now(),
            data["reason"] ?? "",
            data["status"] ?? ApprovalStatus.Pending,
        );
    }
}
