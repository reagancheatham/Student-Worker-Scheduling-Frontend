import { CalendarDate } from "@internationalized/date";

export const WeekDay = {
    Sunday: "Sunday",
    Monday: "Monday",
    Tuesday: "Tuesday",
    Wednesday: "Wednesday",
    Thursday: "Thursday",
    Friday: "Friday",
    Saturday: "Saturday",
} as const;

export type WeekDay = (typeof WeekDay)[keyof typeof WeekDay];

export function toWeekIndex(day: WeekDay): number {
    switch (day) {
        case "Sunday":
            return 0;
        case "Monday":
            return 1;
        case "Tuesday":
            return 2;
        case "Wednesday":
            return 3;
        case "Thursday":
            return 4;
        case "Friday":
            return 5;
        case "Saturday":
            return 6;
        default:
            return 0;
    }
}

export function fromWeekIndex(index: number): WeekDay {
    switch (index) {
        case 0:
            return WeekDay.Sunday;
        case 1:
            return WeekDay.Monday;
        case 2:
            return WeekDay.Tuesday;
        case 3:
            return WeekDay.Wednesday;
        case 4:
            return WeekDay.Thursday;
        case 5:
            return WeekDay.Friday;
        case 6:
            return WeekDay.Saturday;
        default:
            return WeekDay.Sunday;
    }
}

export function stringToWeekDay(str: string): WeekDay {
    switch (str) {
        case "Sunday":
            return WeekDay.Sunday;
        case "Monday":
            return WeekDay.Monday;
        case "Tuesday":
            return WeekDay.Tuesday;
        case "Wednesday":
            return WeekDay.Wednesday;
        case "Thursday":
            return WeekDay.Thursday;
        case "Friday":
            return WeekDay.Friday;
        case "Saturday":
            return WeekDay.Saturday;
        default:
            return WeekDay.Sunday;
    }
}

export function toCalendarDate(
    day: WeekDay,
    sunday: CalendarDate,
): CalendarDate {
    const index = toWeekIndex(day);

    return sunday.add({ days: index });
}
