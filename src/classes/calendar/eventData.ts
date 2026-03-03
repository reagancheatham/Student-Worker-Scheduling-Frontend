import { EventTime } from "./eventTime.ts";

export enum EventColor {
    Blue = "--color-sky-500",
    Orange = "--color-orange-500",
    Red = "--color-red-400",
    Yellow = "--color-yellow-500",
    Purple = "--color-purple-500",
}

export abstract class EventData {
    constructor(
        public name: string,
        public startTime: EventTime,
        public endTime: EventTime,
        public color: EventColor,
        public zIndex: number = 0,
        public leftBisectMargin: number = 0,
        public rightBisectMargin: number = 0,
    ) {}

    isBetween(data: EventData): boolean {
        return (
            this.startTime.isAfterOrEqual(data.startTime) &&
            this.endTime.isBeforeOrEqual(data.endTime)
        );
    }

    bisects(data: EventData): boolean {
        return (
            (this.startTime.isAfterOrEqual(data.startTime) &&
                this.startTime.isBefore(data.endTime)) ||
            (data.startTime.isAfterOrEqual(this.startTime) &&
                data.startTime.isBefore(this.endTime))
        );
    }
}
