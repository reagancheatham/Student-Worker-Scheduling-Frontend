import { DatabaseModel } from "./databaseModel.ts";
import { Employee } from "./employee.ts";
import { Shift } from "./shift.ts";

export class ShiftOfferRequest extends DatabaseModel {
    constructor(
        public id: number,
        public shift: Shift,
        public employeeMessage: string,
        public timeSent: Date,
    ) {
        super();
    }

    public static createFromData(data: any): ShiftOfferRequest {
        return new ShiftOfferRequest(
            data["id"] ?? 0,
            Shift.createFromData(data["Shift"]) ?? null,
            data["employeeMessage"] ?? "",
            data["timeSent"] ?? Date.now(),
        );
    }
}
