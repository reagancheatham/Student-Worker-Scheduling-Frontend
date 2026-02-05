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
        return (
            this.isBefore(other) || this.getTotalTime() === other.getTotalTime()
        );
    }

    isAfter(other: EventTime): boolean {
        return this.getTotalTime() > other.getTotalTime();
    }

    isAfterOrEqual(other: EventTime): boolean {
        return (
            this.isAfter(other) || this.getTotalTime() === other.getTotalTime()
        );
    }

    getTotalTime(): number {
        return 24 * 60 * this.day + 60 * this.hour + this.minute;
    }

    getTimeString(): string {
        let hour = this.hour;
        let minute = this.minute;

        let hourText = "";
        let minuteText = "";
        let periodText = "";

        if (hour > 12) hour -= 12;
        else if (hour == 0) hour = 12;

        hourText = hour.toString();

        if (minute >= 10) minuteText = `${minute}`;
        else minuteText = `0${minute}`;

        if (this.hour == 24 || this.hour < 12) periodText = "AM";
        else periodText = "PM";

        return `${hourText}:${minuteText} ${periodText}`;
    }
}
