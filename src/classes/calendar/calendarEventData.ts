import { EventTime } from "./eventTime.ts";

export enum EventColor {
    Blue = "--color-sky-500",
    Orange = "--color-orange-500",
}

export class CalendarEventData {
    constructor(
        public startTime: EventTime,
        public endTime: EventTime,
        public color: EventColor,
        public zIndex: number = 0,
        public bisectIncrement: number = 0,
    ) {}

    isBetween(data: CalendarEventData): boolean {
        return (
            this.startTime.isAfterOrEqual(data.startTime) &&
            this.endTime.isBeforeOrEqual(data.endTime)
        );
    }

    isBisectable(data: CalendarEventData): boolean {
        return (
            this.startTime.isAfterOrEqual(data.startTime) &&
            this.startTime.isBefore(data.endTime)
        );
    }
}
