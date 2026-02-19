import { CalendarDate, getLocalTimeZone, startOfWeek, today } from "@internationalized/date";
import { ref } from "vue";

type CalendarRange = {
    start: CalendarDate;
    end: CalendarDate;
};

export class CalendarStore {
    public static readonly locale = "en-US";
    public static readonly timeZone = getLocalTimeZone();
    public static refSelectedDate = ref<CalendarDate>();
    public static refSelectedWeek = ref<CalendarRange>();

    public static get selectedDate(): CalendarDate {
        return CalendarStore.refSelectedDate.value as CalendarDate;
    }

    public static set selectedDate(date: CalendarDate) {
        CalendarStore.refSelectedDate.value = date;

        const start = startOfWeek(date, CalendarStore.locale);
        const end = start.add({ days: 6 });

        CalendarStore.refSelectedWeek.value = { start, end };
    }

    public static get selectedWeek(): CalendarRange {
        return CalendarStore.refSelectedWeek.value;
    }
}

CalendarStore.selectedDate = today(CalendarStore.timeZone);