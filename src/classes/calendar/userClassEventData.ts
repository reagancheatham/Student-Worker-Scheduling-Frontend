import { UserClass } from "@classes/database/userClass.ts";
import { EventData } from "./eventData.ts";
import { EventTime } from "./eventTime.ts";
import { EventColor } from "./eventColor.ts";
import { CalendarData } from "./calendarData.ts";
import { EventStyleData } from "./eventStyleData.ts";
import { CalendarMode } from "./calendarMode.ts";

export class UserClassEventData extends EventData {
    constructor(
        public readonly userClass: UserClass,
        date: Date,
    ) {
        const startDate = new Date(date);
        const endDate = new Date(date);

        startDate.setHours(userClass.startTime.hour);
        startDate.setMinutes(userClass.startTime.minute);
        endDate.setHours(userClass.endTime.hour);
        endDate.setMinutes(userClass.endTime.minute);

        super(
            userClass.name,
            EventTime.fromDate(startDate),
            EventTime.fromDate(endDate),
            EventColor.mist,
        );
    }

    public override async updateBackend(): Promise<any> {}

    public override async destroy(): Promise<void> {}

    public override isValid(): boolean {
        return this.userClass.isValid();
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
            "z-index": `0`,
            "border-color": `var(${this.color.border})`,
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

        if (calendarData.selectedView === CalendarMode.Day) {
            let row = 1;

            const employee = this.userClass.employee;

            if (employee) {
                row =
                    calendarData.relevantEmployees.findIndex(
                        (relEmployee) => relEmployee.id === employee.id,
                    ) + 1;

                if (calendarData.hasUnassignedShift) row++;
            }

            return `${row} 
                / ${1 + (60 * startTime.hour + startTime.minute)} 
                / span ${1 + endTime.day - startTime.day} 
                / span ${60 * (endTime.hour - startTime.hour) + (endTime.minute - startTime.minute)}`;
        } else {
            const dayColumn = calendarData.isTemplate
                ? this.templateStartDay
                : startTime.day - calendarData.selectedWeek.start.day;

            const daySpan = calendarData.isTemplate
                ? this.templateEndDay - this.templateStartDay
                : endTime.day - startTime.day;

            return `${1 + (60 * startTime.hour + startTime.minute)} 
                / ${1 + dayColumn} 
                / span ${60 * (endTime.hour - startTime.hour) + (endTime.minute - startTime.minute)} 
                / span ${1 + daySpan}`;
        }
    }
}
