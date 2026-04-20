import { EventColor } from "./eventColor.ts";
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
}
