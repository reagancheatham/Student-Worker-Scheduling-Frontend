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
        return new ShiftOfferRequest(
            data["id"] ?? 0,
            data["shiftID"] ?? 0,
            data["claimingEmployeeID"] ?? 0,
            data["employeeMessage"] ?? "",
            data["timeSent"] ?? undefined,
            data["startTime"] ?? undefined,
            data["endTime"] ?? undefined,
            data["firstname"] ?? undefined,
            data["lastname"] ?? ""
        );
    }
}
