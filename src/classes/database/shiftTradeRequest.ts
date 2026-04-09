import { DatabaseModel } from "./databaseModel.ts";
import { Employee } from "./employee.ts";
import { Shift } from "./shift.ts";

export class ShiftTradeRequest extends DatabaseModel {
    constructor(
        public id: number,
        public targetEmployee: Employee,
        public shift: Shift,
        public employeeMessage: string,
        public timeSent: Date,
    ) {
        super();
    }

    public static createFromData(data: any): ShiftTradeRequest {
        return new ShiftTradeRequest(
            data["id"] ?? 0,
            Employee.createFromData(data["Employee"]) ?? null,
            Shift.createFromData(data["Shift"]) ?? null,
            data["employeeMessage"] ?? "",
            data["timeSent"] ?? Date.now(),
        );
    }
}
