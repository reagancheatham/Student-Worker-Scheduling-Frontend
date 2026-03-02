import { CalendarDate } from "@internationalized/date";

export class EventTime {
    constructor(
        public year: number,
        public month: number,
        public day: number,
        public hour: number,
        public minute: number,
    ) {}

    static fromDate(date: Date): EventTime {
        return new EventTime(
            date.getFullYear(),
            date.getMonth() + 1,
            date.getDate(),
            date.getHours(),
            date.getMinutes(),
        );
    }

    isBefore(other: EventTime): boolean {
        return this.totalTime() < other.totalTime();
    }

    isBeforeOrEqual(other: EventTime): boolean {
        return this.isBefore(other) || this.totalTime() === other.totalTime();
    }

    isAfter(other: EventTime): boolean {
        return this.totalTime() > other.totalTime();
    }

    isAfterOrEqual(other: EventTime): boolean {
        return this.isAfter(other) || this.totalTime() === other.totalTime();
    }

    totalTime(): number {
        const day = new CalendarDate(this.year, this.month, this.day);
        const julianStart = day.calendar.toJulianDay(
            new CalendarDate(day.year, 1, 1),
        );
        const julianEnd = day.calendar.toJulianDay(day);
        const dayValue = 24 * 60 * (julianEnd - julianStart);

        return dayValue + 60 * this.hour + this.minute;
    }

    toTimeString(): string {
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

    toDate(): Date {
        const date = new Date(
            this.year,
            this.month - 1,
            this.day,
            this.hour,
            this.minute,
        );

        return date;
    }

    calendarDate(): CalendarDate {
        return new CalendarDate(this.year, this.month, this.day);
    }

    clone(): EventTime {
        return new EventTime(
            this.year,
            this.month,
            this.day,
            this.hour,
            this.minute,
        );
    }
}
