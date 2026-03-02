import {
    CalendarDate,
    getLocalTimeZone,
    startOfWeek,
    today,
} from "@internationalized/date";
import { ref, shallowRef } from "vue";
import { EventData, EventColor } from "./eventData.ts";
import { CalendarMode } from "./calendarMode.ts";
import { ShiftServices } from "../../services/shiftServices.ts";
import { ShiftEvent } from "./shiftEvent.ts";

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

    public async getEventsForDate(date: CalendarDate): Promise<EventData[]> {
        const beginningOfDay = date.toDate(CalendarData.timeZone);
        const endOfDay = date.toDate(CalendarData.timeZone);
        beginningOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 99);

        let events: EventData[] = [];

        await ShiftServices.getAllInRange(1, beginningOfDay, endOfDay).then(
            (shifts) => {
                events = shifts.map(
                    (shift) => new ShiftEvent(shift, EventColor.Blue),
                );
            },
        );

        return events;
    }

    public async getEventsInDateRange(
        start: CalendarDate,
        end: CalendarDate,
    ): Promise<EventData[]> {
        const startDate = start.toDate(CalendarData.timeZone);
        const endDate = end.toDate(CalendarData.timeZone);

        endDate.setHours(23, 59, 59, 99);

        let events: EventData[] = [];

        await ShiftServices.getAllInRange(1, startDate, endDate).then(
            (shifts) => {
                events = shifts.map(
                    (shift) => new ShiftEvent(shift, EventColor.Blue),
                );
            },
        );

        return events;
    }

    private async updateRelevantEvents() {
        this.relevantEvents.value = [];
        
        if (this.selectedView === CalendarMode.Day) {
            const beginningOfDay = this.selectedDay.toDate(
                CalendarData.timeZone,
            );
            const endOfDay = this.selectedDay.toDate(CalendarData.timeZone);
            beginningOfDay.setHours(0, 0, 0, 0);
            endOfDay.setHours(24, 59, 59, 99);

            this.relevantEvents.value = await this.getEventsForDate(
                this.selectedDay,
            );
        } else {
            this.relevantEvents.value = await this.getEventsInDateRange(
                this.selectedWeek.start,
                this.selectedWeek.end,
            );
        }
    }
}
