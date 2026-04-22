import { EventColor } from "@classes/calendar/eventColor.ts";
import { DatabaseModel } from "./databaseModel.ts";
import {
    fromWeekIndex,
    stringToWeekDay,
    toCalendarDate,
    toWeekIndex,
    WeekDay,
} from "@classes/util/weekDay.ts";
import { ShiftTaskListTemplate } from "./shiftTaskListTemplate.ts";
import { Employee } from "./employee.ts";
import { Role } from "./role.ts";
import { Shift } from "./shift.ts";
import { CalendarDate, getDayOfWeek } from "@internationalized/date";
import { CalendarData } from "@classes/calendar/calendarData.ts";

export class ScheduleShiftTemplate extends DatabaseModel {
    constructor(
        public id: number,
        public readonly scheduleTemplateID: number,
        public name: string,
        public startTime: Date,
        public endTime: Date,
        public color: EventColor,
        public weekDay: WeekDay,
        public taskList: ShiftTaskListTemplate,
        public employee: Employee | undefined = undefined,
        public role: Role | undefined = undefined,
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
        const employee = data["Employee"]
            ? Employee.create(data["Employee"])
            : undefined;
        const role = data["Role"] ? Role.create(data["Role"]) : undefined;

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
            employee,
            role,
        );
    }

    public isValid(): boolean {
        return this.id > 0;
    }

    public toShift(businessID: number, date: CalendarDate): Shift {
        const calendarStartTime = date.toDate(CalendarData.timeZone);

        if (this.endTime.getHours() === 0) date = date.add({ days: 1 });

        const calendarEndTime = date.toDate(CalendarData.timeZone);

        calendarStartTime.setHours(this.startTime.getHours());
        calendarStartTime.setMinutes(this.startTime.getMinutes());

        calendarEndTime.setHours(this.endTime.getHours());
        calendarEndTime.setMinutes(this.endTime.getMinutes());

        return new Shift(
            0,
            businessID,
            this.name,
            calendarStartTime,
            calendarEndTime,
            this.color,
            false,
            this.taskList.toTaskList(),
            this.employee,
            this.role,
        );
    }

    public toShiftRelative(businessID: number, sunday: CalendarDate): Shift {
        const calendarStartTime = toCalendarDate(this.weekDay, sunday).toDate(
            CalendarData.timeZone,
        );

        let endDay = this.weekDay;
        if (this.endTime.getHours() === 0) {
            const index = toWeekIndex(this.weekDay);
            endDay = fromWeekIndex(index + 1);
        }

        const calendarEndTime = toCalendarDate(endDay, sunday).toDate(
            CalendarData.timeZone,
        );

        calendarStartTime.setHours(this.startTime.getHours());
        calendarStartTime.setMinutes(this.startTime.getMinutes());

        calendarEndTime.setHours(this.endTime.getHours());
        calendarEndTime.setMinutes(this.endTime.getMinutes());

        return new Shift(
            0,
            businessID,
            this.name,
            calendarStartTime,
            calendarEndTime,
            this.color,
            false,
            this.taskList.toTaskList(),
            this.employee,
            this.role,
        );
    }

    public toJSON() {
        return {
            id: this.id,
            scheduleTemplateID: this.scheduleTemplateID,
            employeeID: this.employee === undefined ? null : this.employee.id,
            targetRoleID: this.role === undefined ? null : this.role.id,
            name: this.name,
            startTime: this.startTime,
            endTime: this.endTime,
            color: this.color,
            weekDay: this.weekDay,
            taskList: this.taskList,
        };
    }
}
