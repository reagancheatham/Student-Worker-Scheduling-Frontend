import { DatabaseModel } from "./databaseModel";

export class ShiftOfferRequest extends DatabaseModel {
    constructor(
        public readonly id: number,
        public shiftID: number,
        public claimingEmployeeID: number,
        public employeeMessage: string,
        public timeSent: Date,
        public startTime: Date,
        public endTime: Date,
        public firstName: string,
        public lastName: string,
    ) {
        super();
    }

    public static createFromData(data: any): ShiftOfferRequest {
        const shift = data.Shift || {}; //{} is any value except null or undefined
        const employee = shift.Employee || {};
        const user = employee.User || {};

        console.log("createFromData: ", data);

        return new ShiftOfferRequest(
            data.id ?? 0,
            data.shiftID ?? 0,
            data.claimingEmployeeID ?? 0,
            data.employeeMessage ?? "",
            data.timeSent ? new Date(data.timeSent) : new Date(),
            shift.startTime ? new Date(shift.startTime) : new Date(),
            shift.endTime ? new Date(shift.endTime) : new Date(),
            user.firstName ?? "",   // note the correct capitalization "firstName"
            user.lastName ?? "",
        );
    }
}
