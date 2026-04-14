import { DatabaseModel } from "./databaseModel";

export class ShiftOfferRequest extends DatabaseModel {
    constructor(
        public readonly id: number,
        public shiftID: number,
        public claimingEmployeeID: number,
        public employeeMessage: string,
        public timeSent: Date,
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
        );
    }
}
