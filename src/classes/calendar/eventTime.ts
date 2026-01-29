export const enum TimePeriod {
    AM = "AM",
    PM = "PM",
}

export class EventTime {
    constructor(
        public day: number,
        public hour: number,
        public minute: number,
        public period: TimePeriod,
    ) {}

    isBefore(other: EventTime) {
        if (this.day < other.day)
            return true;
        else if (other.day < this.day)
            return false;
        else if (this.period === TimePeriod.AM && other.period === TimePeriod.PM)
            return true;
        else if (this.period === TimePeriod.PM && other.period === TimePeriod.PM)
            return false;
        else if (this.hour < other.hour)
            return true;
        else if (other.hour < this.hour)
            return false;
        else if (this.minute < other.minute)
            return true;
        else
            return false;
    }
}
