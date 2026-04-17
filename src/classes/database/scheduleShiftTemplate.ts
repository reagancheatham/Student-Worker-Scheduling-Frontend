import { EventColor } from "@classes/calendar/eventColor.ts";
import { DatabaseModel } from "./databaseModel.ts";
import { stringToWeekDay, WeekDay } from "@classes/util/weekDay.ts";
import { ShiftTaskListTemplate } from "./shiftTaskListTemplate.ts";

export class ScheduleShiftTemplate extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly scheduleTemplateID: number,
        public name: string,
        public startTime: Date,
        public endTime: Date,
        public color: EventColor,
        public weekDay: WeekDay,
        public taskList: ShiftTaskListTemplate,
    ) {
        super();
    }

    public static createFromData(data: any): ScheduleShiftTemplate {
        const id = data["id"] ?? 0;
        const startTime = data["startTime"]
            ? new Date(data["startTime"])
            : new Date();
        const endTime = data["endTime"]
            ? new Date(data["endTime"])
            : new Date();
        const color = data["color"]
            ? EventColor.fromString(data["color"])
            : EventColor.blue;
        const taskListData = data["ShiftTaskListTemplate"];
        const weekDay = data["weekDay"]
            ? stringToWeekDay(data["weekDay"])
            : WeekDay.Sunday;

        return new ScheduleShiftTemplate(
            id,
            data["scheduleTemplateID"] ?? 0,
            data["name"] ?? "",
            startTime,
            endTime,
            color,
            weekDay,
            taskListData
                ? ShiftTaskListTemplate.createFromData(taskListData)
                : new ShiftTaskListTemplate(0, id, "Task List", []),
        );
    }

    public isValid(): boolean {
        return this.id > 0;
    }
}
