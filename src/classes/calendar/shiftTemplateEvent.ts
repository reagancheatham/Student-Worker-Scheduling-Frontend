import { CalendarData } from "./calendarData.ts";
import { CalendarMode } from "./calendarMode.ts";
import { EventStyleData } from "./eventStyleData.ts";
import { ShiftTemplateEventData } from "./shiftTemplateEventData.ts";

export class ShiftTemplateEvent {
    public static getClass(styleData: EventStyleData): string {
        const event = styleData.event;

        if (!(event instanceof ShiftTemplateEventData)) {
            ShiftTemplateEvent.printTypeError();
            return "";
        }

        return `event ring-inset ring-3 ${event.color.ring}`;
    }

    public static getStyle(styleData: EventStyleData): any {
        const event = styleData.event;
        const calendarData = styleData.calendarData;
        const cellSize = styleData.cellSize;
        const editable = styleData.editable;

        if (!(event instanceof ShiftTemplateEventData)) {
            ShiftTemplateEvent.printTypeError();
            return {};
        }

        let style = {
            "grid-area": ShiftTemplateEvent.getGridArea(event, calendarData),
            "background-color": `color-mix(in srgb, var(${event.color.tailwind}), transparent 40%)`,
            "z-index": `${event.zIndex}`,
            "margin-top": `0`,
            "margin-bottom": `0`,
            "margin-left": `0`,
            "margin-right": `0`,
            cursor: editable ? "pointer" : "cursor",
        };

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

        if (!(event instanceof ShiftTemplateEventData)) {
            ShiftTemplateEvent.printTypeError();
            return "";
        }

        return event.name;
    }

    public static updateBackendEvent(styleData: EventStyleData): void {
        const event = styleData.event;

        if (!(event instanceof ShiftTemplateEventData)) {
            ShiftTemplateEvent.printTypeError();
            return;
        }

        event.updateBackend();
    }

    private static getGridArea(
        event: ShiftTemplateEventData,
        calendarData: CalendarData,
    ): string {
        const startTime = event.startTime;
        const endTime = event.endTime;
        const startDayIndex = event.templateStartDay;
        const endDayIndex = event.templateEndDay;

        if (calendarData.selectedView === CalendarMode.Day) {
            let row = 1;

            const employee = event.template.employee;

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

    private static printTypeError(): void {
        console.error(
            `${ShiftTemplateEvent.name} only accepts ${ShiftTemplateEventData.name}s!`,
        );
    }
}
