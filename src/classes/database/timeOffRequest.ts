import { ApprovalStatus } from "@classes/util/approvalStatus.ts";
import { DatabaseModel } from "./databaseModel.ts";

export class TimeOffRequest extends DatabaseModel {
    constructor(
        public id: number,
        public employeeID: number,
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
            data["employeeID"] ?? 0,
            data["startDate"] ?? Date.now(),
            data["endDate"] ?? Date.now(),
            data["reason"] ?? "",
            data["status"] ?? ApprovalStatus.Pending,
        );
    }
}
