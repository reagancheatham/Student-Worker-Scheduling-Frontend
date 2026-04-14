import { DatabaseModel } from "./databaseModel";

export class ShiftTradeRequest extends DatabaseModel {
    constructor(
        public readonly id: number,
        public shiftID: number,
        public targetEmployeeID: number,
        public employeeMessage: string,
        public timeSent: Date,
    ) {
        super();
    }

    public static createFromData(data: any): ShiftTradeRequest {
        return new ShiftTradeRequest(
            data["id"] ?? 0,
            data["shiftID"] ?? 0,
            data["targetEmployeeID"] ?? 0,
            data["employeeMessage"] ?? "",
            data["timeSent"] ?? undefined,
        );
    }
}
