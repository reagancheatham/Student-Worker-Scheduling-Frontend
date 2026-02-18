import { CalendarDate, getLocalTimeZone, today } from "@internationalized/date";
import { ref } from "vue";

export class CalendarUtil {
    public static readonly locale = "en-US";
    public static readonly timeZone = getLocalTimeZone();
    private static _selectedDate = ref<CalendarDate>(today(CalendarUtil.timeZone));

    public static get selectedDate(): CalendarDate {
        return CalendarUtil._selectedDate.value as CalendarDate;
    }

    public static set selectedDate(date: CalendarDate) {
        CalendarUtil._selectedDate.value = date;
    }
}