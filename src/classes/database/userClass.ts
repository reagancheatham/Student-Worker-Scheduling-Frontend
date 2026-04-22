import { Time } from "@internationalized/date";
import { DatabaseModel } from "./databaseModel.ts";
import { WeekDay } from "@classes/util/weekDay.ts";

export class UserClass extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly userID: number,
        public readonly courseID: string,
        public readonly name: string,
        public readonly startDate: Date,
        public readonly endDate: Date,
        public readonly startTime: Time,
        public readonly endTime: Time,
        public readonly term: string,
        public readonly weekDays: WeekDay[],
    ) {
        super();
    }

    public static createFromData(data: any): UserClass {
        const startDate = data["startDate"]
            ? new Date(data["startDate"])
            : new Date();
        const endDate = data["endDate"]
            ? new Date(data["endDate"])
            : new Date();
        const startTime = data["startTime"]
            ? this.getTimeFromString(data["startTime"])
            : new Time();
        const endTime = data["endTime"]
            ? this.getTimeFromString(data["endTime"])
            : new Time();

        return new UserClass(
            data["id"] ?? 0,
            data["userID"] ?? 0,
            data["courseID"] ?? 0,
            data["name"] ?? "User Class",
            startDate,
            endDate,
            startTime,
            endTime,
            data["term"] ?? "",
            data["weekDays"] ?? [],
        );
    }
    
    private static getTimeFromString(timeString: string): Time {
        const timeParts = timeString.trim().match(/^(\d{2}):(\d{2})$/);
        if (!timeParts) {
            console.error(`Could not read valid time from: ${timeString}`);
            return new Time();
        }

        const hour = Number.parseInt(timeParts[1], 10);
        const minute = Number.parseInt(timeParts[2], 10);

        if (hour < 1 || hour > 12 || minute < 0 || minute > 59) {
            console.error(`Could not read valid time from: ${timeString}`);
            return new Time();
        }

        return new Time(hour, minute);
    }
}
