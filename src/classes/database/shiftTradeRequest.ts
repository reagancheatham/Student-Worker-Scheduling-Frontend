import { DatabaseModel } from "./databaseModel.ts";
import { Employee } from "./employee.ts";
import { Shift } from "./shift.ts";

export class ShiftTradeRequest extends DatabaseModel {
    constructor(
        public id: number,
        public targetEmployee: Employee | undefined,
        public shift: Shift | undefined,
        public employeeMessage: string,
        public timeSent: Date,
    ) {
        super();
    }

    public static createFromData(data: any): ShiftTradeRequest {
        const shift = data["Shift"]
            ? Shift.createFromData(data["Shift"])
            : undefined;
        const employee = data["Employee"]
            ? Employee.createFromData(data["Employee"])
            : undefined;

        console.log("DATA: " + JSON.stringify(data));

        return new ShiftTradeRequest(
            data["id"] ?? 0,
            employee,
            shift,
            data["employeeMessage"] ?? "",
            data["timeSent"] ?? Date.now(),
        );
    }

    public toJSON() {
        return {
            id: this.id,
            shiftID: this.shift?.id,
            targetEmployeeID: this.targetEmployee?.id,
            employeeMessage: this.employeeMessage,
            timeSent: this.timeSent,
        };
    }
}
