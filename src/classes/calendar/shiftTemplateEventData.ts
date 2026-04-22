import { EventData } from "./eventData.ts";
import { EventTime } from "./eventTime.ts";
import { ScheduleShiftTemplate } from "@classes/database/scheduleShiftTemplate.ts";
import { ScheduleShiftTemplateServices } from "../../services/scheduleShiftTemplateServices.ts";
import { fromWeekIndex, toWeekIndex } from "@classes/util/weekDay.ts";
import { CalendarData } from "./calendarData.ts";
import { EventStyleData } from "./eventStyleData.ts";
import { CalendarMode } from "./calendarMode.ts";

export class ShiftTemplateEventData extends EventData {
    constructor(public readonly template: ScheduleShiftTemplate) {
        super(
            template.name,
            EventTime.fromDate(template.startTime),
            EventTime.fromDate(template.endTime, true),
            template.color,
        );

        this.templateStartDay = toWeekIndex(template.weekDay);
        this.templateEndDay = toWeekIndex(template.weekDay);
    }

    public override async updateBackend(): Promise<ScheduleShiftTemplate> {
        this.template.name = this.name;
        this.template.startTime = this.startTime.toDate();
        this.template.endTime = this.endTime.toDate();
        this.template.color = this.color;
        this.template.weekDay = fromWeekIndex(this.templateStartDay);

        let updatedShift: ScheduleShiftTemplate = this.template;

        if (this.template.isValid())
            await ScheduleShiftTemplateServices.update(this.template);
        else
            updatedShift = await ScheduleShiftTemplateServices.create(
                this.template,
            );

        const taskList =
            await this.template.taskList.updateBackend(updatedShift);

        this.template.id = updatedShift.id;
        this.template.taskList = taskList;

        return updatedShift;
    }

    public override async destroy(): Promise<void> {
        if (!this.template.isValid()) return;

        return ScheduleShiftTemplateServices.delete(this.template);
    }

    public override isValid(): boolean {
        return this.template.isValid();
    }

    public override getClass(styleData: EventStyleData): string {
        return `event ring-inset ring-3 ${this.color.ring}`;
    }

    public override getStyle(styleData: EventStyleData) {
        const calendarData = styleData.calendarData;
        const cellSize = styleData.cellSize;
        const editable = styleData.editable;

        let style = {
            "grid-area": this.getGridArea(calendarData),
            "background-color": `color-mix(in srgb, var(${this.color.tailwind}), transparent 40%)`,
            "z-index": `${this.zIndex}`,
            "margin-top": `0`,
            "margin-bottom": `0`,
            "margin-left": `0`,
            "margin-right": `0`,
            cursor: editable ? "pointer" : "cursor",
        };

        if (calendarData.selectedView == CalendarMode.Day) {
            style["margin-top"] =
                `${(this.leftBisectMargin / 100) * cellSize.y}px`;
            style["margin-bottom"] =
                `${(this.rightBisectMargin / 100) * cellSize.y}px`;
        } else {
            style["margin-left"] = `${this.leftBisectMargin}%`;
            style["margin-right"] = `${this.rightBisectMargin}%`;
        }

        return style;
    }

    public override getLabel(styleData: EventStyleData): string {
        return this.name;
    }

    public override getGridArea(calendarData: CalendarData): string {
        const startTime = this.startTime;
        const endTime = this.endTime;
        const startDayIndex = this.templateStartDay;
        const endDayIndex = this.templateEndDay;

        console.log("start day: " + JSON.stringify(startTime));
        console.log("end day: " + JSON.stringify(endTime));

        if (calendarData.selectedView === CalendarMode.Day) {
            let row = 1;

            const employee = this.template.employee;

            if (employee) {
                row =
                    calendarData.relevantEmployees.findIndex(
                        (relEmployee) => relEmployee.id === employee.id,
                    ) + 1;

                if (calendarData.hasUnassignedShift) row++;
            }

            return `${row} 
            / ${1 + (60 * startTime.hour + startTime.minute)} 
            / span ${1 + endDayIndex - startDayIndex} 
            / span ${60 * (endTime.hour - startTime.hour) + (endTime.minute - startTime.minute)}`;
        } else
            return `${1 + (60 * startTime.hour + startTime.minute)} 
            / ${1 + startDayIndex} 
            / span ${60 * (endTime.hour - startTime.hour) + (endTime.minute - startTime.minute)} 
            / span ${1 + (endDayIndex - startDayIndex)}`;
    }
}
