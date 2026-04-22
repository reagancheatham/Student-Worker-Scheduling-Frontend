import { DatabaseModel } from "./databaseModel.ts";
import { WeekDay } from "@classes/util/weekDay.ts";
import { Employee } from "./employee.ts";

export class ClassTime {
    constructor(
        public hour: number,
        public minute: number,
    ) {}
}

export class UserClass extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly userID: number,
        public readonly courseID: string,
        public name: string,
        public startDate: Date,
        public endDate: Date,
        public startTime: ClassTime,
        public endTime: ClassTime,
        public readonly term: string,
        public readonly weekDays: WeekDay[],
        public readonly employee: Employee,
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
            : new ClassTime(0, 0);
        const endTime = data["endTime"]
            ? this.getTimeFromString(data["endTime"])
            : new ClassTime(0, 0);
        const user = data["User"];

        if (!user)
            throw Error(
                `Failed to fetch employee from data: ${JSON.stringify(data)}`,
            );

        const employee = user["Employees"]
            ? Employee.create(user["Employees"][0])
            : undefined;

        if (!employee)
            throw Error(
                `Failed to fetch employee from data: ${JSON.stringify(data)}`,
            );

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
            employee,
        );
    }

    public isValid(): boolean {
        return this.id > 0;
    }

    private static getTimeFromString(timeString: string): ClassTime {
        const timeParts = timeString.trim().match(/^(\d{2}):(\d{2}):(\d{2})$/);

        if (!timeParts) {
            console.error(`Could not read valid time from: ${timeString}`);
            return new ClassTime(0, 0);
        }

        const hour = Number.parseInt(timeParts[1], 10);
        const minute = Number.parseInt(timeParts[2], 10);

        if (hour < 0 || hour > 24 || minute < 0 || minute > 59) {
            console.error(`Could not read valid time from: ${timeString}`);
            return new ClassTime(0, 0);
        }

        return new ClassTime(hour, minute);
    }
}
