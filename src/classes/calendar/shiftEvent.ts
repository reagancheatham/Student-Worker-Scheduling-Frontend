import { CalendarData } from "./calendarData.ts";
import { CalendarMode } from "./calendarMode.ts";
import { ShiftEventData } from "./shiftEventData.ts";
import { EventStyleData } from "./eventStyleData.ts";

export class ShiftEvent {
    public static getClass(styleData: EventStyleData): string {
        const event = styleData.event;

        if (!(event instanceof ShiftEventData)) {
            ShiftEvent.printTypeError();
            return "";
        }

        if (event.shift.published) return `event ring-2 ${event.color.ring}`;
        else return "event";
    }

    public static getStyle(styleData: EventStyleData): any {
        const event = styleData.event;
        const calendarData = styleData.calendarData;
        const cellSize = styleData.cellSize;
        const editable = styleData.editable;

        if (!(event instanceof ShiftEventData)) {
            ShiftEvent.printTypeError();
            return {};
        }

        let style = {
            "grid-area": ShiftEvent.getGridArea(event, calendarData),
            "background-color": `var(${event.color.tailwind})`,
            "z-index": `${event.zIndex}`,
            "border-color": `var(${event.color.border})`,
            "margin-top": `0`,
            "margin-bottom": `0`,
            "margin-left": `0`,
            "margin-right": `0`,
            cursor: editable ? "pointer" : "cursor",
        };

        if (event instanceof ShiftEventData && !event.shift.published)
            style["background-color"] =
                `color-mix(in srgb, var(${event.color.tailwind}), transparent 40%)`;

        if (calendarData.selectedView == CalendarMode.Day) {
            style["margin-top"] =
                `${(event.leftBisectMargin / 100) * cellSize.y}px`;
            style["margin-bottom"] =
                `${(event.rightBisectMargin / 100) * cellSize.y}px`;
        } else {
            style["margin-left"] = `${event.leftBisectMargin}%`;
            style["margin-right"] = `${event.rightBisectMargin}%`;
        }

        return style;
    }

    public static getLabel(styleData: EventStyleData): string {
        const event = styleData.event;

        if (!(event instanceof ShiftEventData)) {
            ShiftEvent.printTypeError();
            return "";
        }

        if (event.shift.published) return event.name;
        else return `${event.name} - Unpublished`;
    }

    public static updateBackendEvent(styleData: EventStyleData): void {
        const event = styleData.event;

        if (!(event instanceof ShiftEventData)) {
            ShiftEvent.printTypeError();
            return;
        }

        event.updateBackend();
    }

    private static getGridArea(
        event: ShiftEventData,
        calendarData: CalendarData,
    ): string {
        const startTime = event.startTime;
        const endTime = event.endTime;

        if (calendarData.selectedView === CalendarMode.Day) {
            let row = 1;

            const employee = event.shift.employee;

            if (employee)
                row =
                    calendarData.relevantEmployees.findIndex(
                        (relEmployee) => relEmployee.id === employee.id,
                    ) + 1;

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

    private static printTypeError(): void {
        console.error(
            `${ShiftEvent.name} only accepts ${ShiftEventData.name}s!`,
        );
    }
}
