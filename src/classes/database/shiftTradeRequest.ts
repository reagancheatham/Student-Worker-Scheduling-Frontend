import { DatabaseModel } from "./databaseModel.ts";
import { Employee } from "./employee.ts";
import { Shift } from "./shift.ts";

export class ShiftTradeRequest extends DatabaseModel {
    constructor(
        public id: number,
        public employee: Employee | null,
        public targetEmployee: Employee | null,
        public shift: Shift,
        public employeeMessage: string,
        public timeSent: Date,
    ) {
        super();
    }

    public static createFromData(data: any): ShiftTradeRequest {
        const shift = Shift.createFromData(data["Shift"]) ?? null;
        return new ShiftTradeRequest(
            data["id"] ?? 0,
            shift?.employee ?? null,
            Employee.createFromData(data["TargetEmployee"]) ?? null,
            shift,
            data["employeeMessage"] ?? "",
            data["timeSent"] ?? Date.now(),
        );
    }
}
