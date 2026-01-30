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
    ) {}
}
