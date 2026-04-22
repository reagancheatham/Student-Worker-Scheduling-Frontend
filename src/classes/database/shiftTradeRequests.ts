import { ApprovalStatus } from "@classes/util/approvalStatus";
import { DatabaseModel } from "./databaseModel";

export class ShiftTradeRequest extends DatabaseModel {
    constructor(
        public readonly id: number,
        public shiftID: number,
        public targetEmployeeID: number,
        public employeeMessage: string,
        public timeSent: Date,
        public approvalStatus: ApprovalStatus,
        public startTime: Date,
        public endTime: Date,
        public userID: number,
        public firstName: string,
        public lastName: string,
    ) {
        super();
    }

    public static createFromData(data: any): ShiftTradeRequest {
        const shift = data.Shift || {}; //{} is any value except null or undefined
        const employee = shift.Employee || {};
        const user = employee.User || {};

        return new ShiftTradeRequest(
            data.id ?? 0,
            data.shiftID ?? 0,
            data.targetEmployeeID ?? 0,
            data.employeeMessage ?? "",
            data.timeSent ? new Date(data.timeSent) : new Date(),
            data.approvalStatus ?? null,
            shift.startTime ? new Date(shift.startTime) : new Date(),
            shift.endTime ? new Date(shift.endTime) : new Date(),
            user.id ?? 0,
            user.firstName ?? "",
            user.lastName ?? "",
        );
    }

    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
