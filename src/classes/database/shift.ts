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

    /* date formatting incase we need it */
    //1-12
    public get day(): string {
        return this.startTime.getDate().toString();
    }

    //April
    public get month(): string {
        return this.startTime.toLocaleString("default", { month: "long" });
    }

    //apr
    public get shortMonth(): string {
        return this.startTime.toLocaleString("default", { month: "short" });
    }

    //2026
    public get year(): string {
        return this.startTime.getFullYear().toString();
    }

    //Thursday
    public get weekday(): string {
        return this.startTime.toLocaleString("default", { weekday: "long" });
    }

    //Thu
    public get shortWeekday(): string {
        return this.startTime.toLocaleString("default", { weekday: "short" });
    }

    //2:00 PM to 5:00 PM
    public get shiftTime(): string {
        const formatTime = (date: Date): string => {
            return date.toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        };

        return `${formatTime(this.startTime)} to ${formatTime(this.endTime)}`;
    }

    //2:00 PM
    public get startTimeFormatted(): string {
        return this.startTime.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    //5:00 PM
    public get endTimeFormatted(): string {
        return this.endTime.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    //April 9, 2026
    public get dateFormatted(): string {
        return this.startTime.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }

    public isStartingSoon(): boolean {
        const now = new Date();
        const diff = Math.abs(now.getTime() - this.startTime.getTime());
        return diff <= 60 * 60 * 1000; // 1 hour in ms
    }

    public isLate(): boolean {
        const now = new Date();
        return now.getTime() > this.startTime.getTime();
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
            day: this.day,
            month: this.month,
            shortMonth: this.shortMonth,
            year: this.year,
            weekday: this.weekday,
            shortWeekday: this.shortWeekday,
            shiftTime: this.shiftTime,
            startTimeFormatted: this.startTimeFormatted,
            endTimeFormatted: this.endTimeFormatted,
            dateFormatted: this.dateFormatted,
        };
    }

    public isValid() {
        return this.id != 0;
    }
}
