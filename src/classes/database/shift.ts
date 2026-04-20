import { EventColor } from "@classes/calendar/eventColor.ts";
import { DatabaseModel } from "./databaseModel.ts";
import { Employee } from "./employee.ts";
import { Role } from "./role.ts";

export class Shift extends DatabaseModel {
    public constructor(
        public readonly id: number,
        public readonly businessID: number,
        public name: string,
        public startTime: Date,
        public endTime: Date,
        public color: EventColor,
        public published: boolean,
        public employee: Employee | undefined = undefined,
        public role: Role | undefined = undefined,
    ) {
        super();
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
            ? Employee.createFromData(data["Employee"])
            : undefined;

        return new Shift(
            data["id"] ?? 0,
            data["businessID"] ?? 0,
            data["name"] ?? 0,
            startTime,
            endTime,
            color,
            data["published"] ?? false,
            employee,
        );
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

    public get shiftLengthHours(): string {
        const diffMs = this.endTime.getTime() - this.startTime.getTime();
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);

        return `${hours}`;
    }

    public get shiftLengthMinutes(): string {
        const diffMs = this.endTime.getTime() - this.startTime.getTime();
        const totalSeconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return `${minutes}`;
    }

    public getShiftLength(): string {
        const hours = parseInt(this.shiftLengthHours) || 0;
        const minutes = parseInt(this.shiftLengthMinutes) || 0;

        const parts: string[] = [];

        if (hours > 0) {
            parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
        }
        if (minutes > 0) {
            parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
        }

        if (parts.length === 0) {
            return "0 minutes";
        }

        return parts.join(" and ");
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
            employeeID:
                !this.employee || this.employee.id === 0
                    ? null
                    : this.employee.id,
            targetRoleID:
                !this.role || this.role.id === 0 ? null : this.role.id,
            name: this.name,
            startTime: this.startTime,
            endTime: this.endTime,
            color: this.color,
            published: this.published,
        };
    }

    public isValid() {
        return this.id != 0;
    }
}
