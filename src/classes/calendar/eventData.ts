import { CalendarData } from "./calendarData.ts";
import { EventColor } from "./eventColor.ts";
import { EventStyleData } from "./eventStyleData.ts";
import { EventTime } from "./eventTime.ts";

export abstract class EventData {
    constructor(
        public name: string,
        public startTime: EventTime,
        public endTime: EventTime,
        public color: EventColor,
        public zIndex: number = 0,
        public leftBisectMargin: number = 0,
        public rightBisectMargin: number = 0,
        public templateStartDay: number = 0,
        public templateEndDay: number = 0,
    ) {}

    isBetween(data: EventData): boolean {
        return (
            this.startTime.isAfterOrEqual(data.startTime) &&
            this.endTime.isBeforeOrEqual(data.endTime)
        );
    }

    bisects(data: EventData): boolean {
        if (this.startTime.day !== this.endTime.day) return false;
        else if (data.startTime.day !== data.endTime.day) return false;

        return (
            (this.startTime.isAfterOrEqual(data.startTime) &&
                this.startTime.isBefore(data.endTime) &&
                this.templateStartDay == data.templateStartDay) ||
            (data.startTime.isAfterOrEqual(this.startTime) &&
                data.startTime.isBefore(this.endTime) &&
                this.templateStartDay == data.templateStartDay)
        );
    }

    abstract updateBackend(): Promise<any>;

    abstract destroy(): Promise<void>;

    abstract isValid(): boolean;

    abstract getClass(styleData: EventStyleData): string;

    abstract getStyle(styleData: EventStyleData): any;

    abstract getLabel(styleData: EventStyleData): string;

    abstract getGridArea(calendarData: CalendarData): string;
}
