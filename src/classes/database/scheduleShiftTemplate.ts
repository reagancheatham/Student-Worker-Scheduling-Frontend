import { EventColor } from "@classes/calendar/eventColor.ts";
import { DatabaseModel } from "./databaseModel.ts";

export class ScheduleShiftTemplate extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly scheduleTemplateID: number,
        public name: string,
        public startTime: Date,
        public endTime: Date,
        public color: EventColor,
    ) {
        super();
    }

    public static createFromData(data: any): ScheduleShiftTemplate {
        const startTime = data["startTime"]
            ? new Date(data["startTime"])
            : new Date();
        const endTime = data["endTime"]
            ? new Date(data["endTime"])
            : new Date();
        const color = data["color"]
            ? EventColor.fromString(data["color"])
            : EventColor.blue;

        return new ScheduleShiftTemplate(
            data["id"] ?? 0,
            data["scheduleTemplateID"] ?? 0,
            data["name"] ?? "",
            startTime,
            endTime,
            color,
        );
    }

    public isValid(): boolean {
        return this.id > 0;
    }
}
