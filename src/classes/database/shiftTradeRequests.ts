import { DatabaseModel } from "./databaseModel";

export class ShiftTradeRequest extends DatabaseModel {
    constructor(
        public readonly id: number,
        public shiftID: number,
        public targetEmployeeID: number,
        public employeeMessage: string,
        public timeSent: Date,
        public status: string,
        public startTime: Date,
        public endTime: Date,
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
            data.status ?? null,
            shift.startTime ? new Date(shift.startTime) : new Date(),
            shift.endTime ? new Date(shift.endTime) : new Date(),
            user.firstName ?? "",
            user.lastName ?? "",
        );
    }

    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}
