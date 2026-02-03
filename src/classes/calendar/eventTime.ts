export class EventTime {
    constructor(
        public day: number,
        public hour: number,
        public minute: number,
    ) {}

    isBefore(other: EventTime): boolean {
        return this.getTotalTime() < other.getTotalTime();
    }

    isBeforeOrEqual(other: EventTime): boolean {
        return this.isBefore(other) || this.getTotalTime() === other.getTotalTime();
    }

    isAfter(other: EventTime): boolean {
        return this.getTotalTime() > other.getTotalTime();
    }

    isAfterOrEqual(other: EventTime): boolean {
        return this.isAfter(other) || this.getTotalTime() === other.getTotalTime();
    }

    getTotalTime(): number {
        return (24 * 60 * this.day) + (60 * this.hour) + this.minute;
    }
}
