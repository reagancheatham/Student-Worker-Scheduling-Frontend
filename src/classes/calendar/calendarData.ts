import {
    CalendarDate,
    getLocalTimeZone,
    isSameDay,
    startOfWeek,
    today,
} from "@internationalized/date";
import { ref, shallowRef } from "vue";
import { EventData, EventColor } from "./eventData.ts";
import { EventTime } from "./eventTime.ts";
import { CalendarMode } from "./calendarMode.ts";

type CalendarRange = {
    start: CalendarDate;
    end: CalendarDate;
};

export class CalendarData {
    public static readonly locale = "en-US";
    public static readonly timeZone = getLocalTimeZone();
    public readonly refSelectedView = ref<CalendarMode>(CalendarMode.Week);
    public readonly refSelectedDay = shallowRef<CalendarDate>(
        today(CalendarData.timeZone),
    );
    public readonly refSelectedWeek = shallowRef<CalendarRange>({
        start: today(CalendarData.timeZone),
        end: today(CalendarData.timeZone).add({ days: 6 }),
    });
    public readonly refEvents = ref<EventData[]>([
        new EventData(
            "First Event",
            new EventTime(2026, 2, 19, 9, 0),
            new EventTime(2026, 2, 19, 17, 30),
            EventColor.Blue,
        ),
        new EventData(
            "Second Event",
            new EventTime(2026, 2, 20, 7, 0),
            new EventTime(2026, 2, 20, 15, 30),
            EventColor.Orange,
        ),
    ]);
    public readonly relevantEvents = ref<EventData[]>([]);
    
    constructor(selectedView: CalendarMode, selectedDay: CalendarDate) {
        this.refSelectedView.value = selectedView;
        this.selectedDay = selectedDay;
    }

    public get selectedView(): CalendarMode {
        return this.refSelectedView.value;
    }

    public set selectedView(mode: CalendarMode) {
        this.refSelectedView.value = mode;

        this.updateRelevantEvents();
    }

    public get selectedDay(): CalendarDate {
        return this.refSelectedDay.value;
    }

    public set selectedDay(date: CalendarDate) {
        this.refSelectedDay.value = date;

        const start = startOfWeek(date, CalendarData.locale);
        const end = start.add({ days: 6 });

        this.refSelectedWeek.value = { start, end };

        this.updateRelevantEvents();
    }

    public get selectedWeek(): CalendarRange {
        return this.refSelectedWeek.value;
    }

    public getEventsForDate(date: CalendarDate): EventData[] {
        return this.refEvents.value.filter((evt) => {
            if (isSameDay(evt.startTime.calendarDate(), date)) return evt;
        });
    }

    public getEventsInDateRange(
        start: CalendarDate,
        end: CalendarDate,
    ): EventData[] {
        return this.refEvents.value.filter((evt) => {
            const eventDate = evt.startTime.calendarDate();

            if (eventDate.compare(start) >= 0 && eventDate.compare(end) <= 0)
                return evt;
        });
    }

    private updateRelevantEvents() {
        if (this.selectedView === CalendarMode.Day)
            this.relevantEvents.value = this.getEventsForDate(this.selectedDay);
        else
            this.relevantEvents.value = this.getEventsInDateRange(
                this.selectedWeek.start,
                this.selectedWeek.end,
            );
    }
}
