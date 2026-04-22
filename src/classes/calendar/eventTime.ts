import { CalendarDate, Time } from "@internationalized/date";

export class EventTime {
    constructor(
        public year: number,
        public month: number,
        public day: number,
        public hour: number,
        public minute: number,
    ) {}

    static fromDate(date: Date, endTime: boolean = false): EventTime {
        let day = date.getDate();
        let hours = date.getHours();

        if (endTime && hours === 0) {
            day--;
            hours = 24;
        }

        return new EventTime(
            date.getFullYear(),
            date.getMonth() + 1,
            day,
            hours,
            date.getMinutes(),
        );
    }

    public isBefore(other: EventTime): boolean {
        return this.totalTime() < other.totalTime();
    }

    public isBeforeOrEqual(other: EventTime): boolean {
        return this.isBefore(other) || this.totalTime() === other.totalTime();
    }

    public isAfter(other: EventTime): boolean {
        return this.totalTime() > other.totalTime();
    }

    public isAfterOrEqual(other: EventTime): boolean {
        return this.isAfter(other) || this.totalTime() === other.totalTime();
    }

    public toTime(): Time {
        return new Time(this.hour, this.minute);
    }

    public totalTime(): number {
        const day = new CalendarDate(this.year, this.month, this.day);
        const julianStart = day.calendar.toJulianDay(
            new CalendarDate(day.year, 1, 1),
        );
        const julianEnd = day.calendar.toJulianDay(day);
        const dayValue = 24 * 60 * (julianEnd - julianStart);

        return dayValue + 60 * this.hour + this.minute;
    }

    public toTimeString(): string {
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

    public toIsoTimeString(): string {
        let hour = this.hour;
        let minute = this.minute;

        let hourText = "";
        let minuteText = "";

        if (hour > 12) hour -= 12;
        else if (hour == 0) hour = 12;

        hourText = hour > 9 ? hour.toString() : `0${hour.toString()}`;

        if (minute >= 10) minuteText = `${minute}`;
        else minuteText = `0${minute}`;

        return `${hourText}:${minuteText}`;
    }

    public toDate(): Date {
        let day = this.day;
        let hour = this.hour;

        if (this.hour === 24) {
            day++;
            hour = 0;
        }

        const date = new Date(
            this.year,
            this.month - 1,
            day,
            hour,
            this.minute,
        );

        return date;
    }

    public calendarDate(): CalendarDate {
        return new CalendarDate(this.year, this.month, this.day);
    }

    public clone(): EventTime {
        return new EventTime(
            this.year,
            this.month,
            this.day,
            this.hour,
            this.minute,
        );
    }
}
