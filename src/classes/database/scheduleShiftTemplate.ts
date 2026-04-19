import { EventColor } from "@classes/calendar/eventColor.ts";
import { DatabaseModel } from "./databaseModel.ts";
import { stringToWeekDay, WeekDay } from "@classes/util/weekDay.ts";
import { ShiftTaskListTemplate } from "./shiftTaskListTemplate.ts";
import { Employee } from "./employee.ts";

export class ScheduleShiftTemplate extends DatabaseModel {
    private _employeeID: number;

    constructor(
        public readonly id: number,
        public readonly scheduleTemplateID: number,
        public name: string,
        public startTime: Date,
        public endTime: Date,
        public color: EventColor,
        public weekDay: WeekDay,
        public taskList: ShiftTaskListTemplate,
        private _employee: Employee | undefined = undefined,
    ) {
        super();

        this._employeeID = _employee ? _employee.id : 0;
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
        );
    }

    public get employee(): Employee | undefined {
        return this._employee;
    }

    public set employee(value: Employee | undefined) {
        this._employee = value;

        if (value) this._employeeID = value.id;
        else this._employeeID = 0;
    }

    public isValid(): boolean {
        return this.id > 0;
    }

    public toJSON() {
        return {
            id: this.id,
            scheduleTemplateID: this.scheduleTemplateID,
            employeeID: this._employeeID === 0 ? null : this._employeeID,
            name: this.name,
            startTime: this.startTime,
            endTime: this.endTime,
            color: this.color,
            weekDay: this.weekDay,
            taskList: this.taskList,
        };
    }
}
