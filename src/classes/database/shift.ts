import { EventColor } from "@classes/calendar/eventColor.ts";
import { DatabaseModel } from "./databaseModel.ts";
import { Employee } from "./employee.ts";

export class Shift extends DatabaseModel {
    private _employeeID: number;

    public constructor(
        public readonly id: number,
        public readonly businessID: number,
        public name: string,
        public startTime: Date,
        public endTime: Date,
        public color: EventColor,
        private _employee: Employee,
    ) {
        super();

        this._employeeID = _employee ? _employee.id : 0;
    }

    public static createFromData(data: any): Shift {
        const startTime = data["startTime"]
            ? new Date(data["startTime"])
            : new Date();
        const endTime = data["endTime"]
            ? new Date(data["endTime"])
            : new Date();
        const color = data["color"]
            ? EventColor.fromString(data["color"])
            : EventColor.blue;
        const employee = data["Employee"]
            ? Employee.create(data["Employee"])
            : undefined;

        return new Shift(
            data["id"] ?? 0,
            data["businessID"] ?? 0,
            data["name"] ?? 0,
            startTime,
            endTime,
            color,
            employee,
        );
    }

    public get employee(): Employee {
        return this._employee;
    }

    public set employee(value: Employee) {
        this._employee = value;

        if (value) this._employeeID = value.id;
    }

    public toJSON() {
        return {
            id: this.id,
            businessID: this.businessID,
            employeeID: this._employeeID === 0 ? null : this._employeeID,
            name: this.name,
            startTime: this.startTime,
            endTime: this.endTime,
            color: this.color,
            employee: this._employee,
        };
    }

    public isValid() {
        return this.id != 0;
    }
}
