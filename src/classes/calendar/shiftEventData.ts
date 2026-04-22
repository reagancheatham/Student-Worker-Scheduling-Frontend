import { Shift } from "@classes/database/shift.ts";
import { EventData } from "./eventData.ts";
import { EventTime } from "./eventTime.ts";
import { ShiftServices } from "../../services/shiftServices.ts";
import { CalendarData } from "./calendarData.ts";
import { EventStyleData } from "./eventStyleData.ts";
import { CalendarMode } from "./calendarMode.ts";
import { Store } from "@classes/util/store/store.ts";
import { EventColor } from "./eventColor.ts";

export class ShiftEventData extends EventData {
    constructor(public readonly shift: Shift) {
        super(
            shift.name,
            EventTime.fromDate(shift.startTime),
            EventTime.fromDate(shift.endTime, true),
            shift.color,
        );
    }

    public override async updateBackend(): Promise<Shift> {
        this.shift.name = this.name;
        this.shift.startTime = this.startTime.toDate();
        this.shift.endTime = this.endTime.toDate();
        this.shift.color = this.color;

        let updatedShift: Shift = this.shift;

        if (this.shift.isValid())
            updatedShift = await ShiftServices.update(this.shift);
        else updatedShift = await ShiftServices.create(this.shift);

        const taskList = await this.shift.taskList.updateBackend(updatedShift);

        this.shift.id = updatedShift.id;
        this.shift.taskList = taskList;

        return updatedShift;
    }

    public override async destroy(): Promise<void> {
        if (!this.shift.isValid()) return;

        return ShiftServices.delete(this.shift);
    }

    public override isValid(): boolean {
        return this.shift.isValid();
    }

    public override getClass(styleData: EventStyleData): string {
        if (!this.shift.published)
            return `event ring-inset ring-3 ${this.color.ring}`;
        else return "event";
    }

    public override getStyle(styleData: EventStyleData) {
        const calendarData = styleData.calendarData;
        const cellSize = styleData.cellSize;
        const editable = styleData.editable;

        let style = {
            "grid-area": this.getGridArea(calendarData),
            "background-color": `var(${this.color.tailwind})`,
            "z-index": `${this.zIndex}`,
            "border-color": `var(${this.color.border})`,
            "margin-top": `0`,
            "margin-bottom": `0`,
            "margin-left": `0`,
            "margin-right": `0`,
            cursor: editable ? "pointer" : "cursor",
        };

        if (styleData.calendarData.isEmployeeView) {
            const user = Store.userStore.getImmediate();

            if (!user || this.shift.employee?.userID !== user.id)
                style["background-color"] =
                    `color-mix(in srgb, var(${EventColor.mist.tailwind}), transparent 40%)`;
        } else if (!this.shift.published)
            style["background-color"] =
                `color-mix(in srgb, var(${this.color.tailwind}), transparent 40%)`;

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
        if (this.shift.published) return this.name;
        else return `${this.name} - Unpublished`;
    }

    public override getGridArea(calendarData: CalendarData): string {
        const startTime = this.startTime;
        const endTime = this.endTime;

        console.log("startTime: " + JSON.stringify(startTime));
        console.log("endtime: " + JSON.stringify(endTime));

        if (calendarData.selectedView === CalendarMode.Day) {
            let row = 1;

            const employee = this.shift.employee;

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
        } else
            return `${1 + (60 * startTime.hour + startTime.minute)} 
            / ${1 + startTime.day - calendarData.selectedWeek.start.day} 
            / span ${60 * (endTime.hour - startTime.hour) + (endTime.minute - startTime.minute)} 
            / span ${1 + (endTime.day - startTime.day)}`;
    }
}
