import {
    CalendarDate,
    getLocalTimeZone,
    startOfWeek,
    today,
} from "@internationalized/date";
import { ref, shallowRef } from "vue";
import { EventData } from "./eventData.ts";
import { CalendarMode } from "./calendarMode.ts";
import { ShiftServices } from "../../services/shiftServices.ts";
import { ShiftEvent } from "./shiftEvent.ts";
import { Employee } from "@classes/database/employee.ts";
import { en } from "@nuxt/ui/runtime/locale/index.js";
import { Store } from "@classes/util/store.ts";

type CalendarRange = {
    start: CalendarDate;
    end: CalendarDate;
};

export class CalendarData {
    public static readonly locale = en;
    public static readonly localeString = "en-US";
    public static readonly timeZone = getLocalTimeZone();
    public readonly refSelectedView = ref<CalendarMode>(CalendarMode.Week);
    public readonly refSelectedDay = shallowRef<CalendarDate>(
        today(CalendarData.timeZone),
    );
    public readonly refSelectedWeek = shallowRef<CalendarRange>({
        start: today(CalendarData.timeZone),
        end: today(CalendarData.timeZone).add({ days: 6 }),
    });
    public readonly refEmployees = ref<Employee[]>([]);
    public readonly refRelevantEmployees = ref<Employee[]>([]);
    public readonly refRelevantEvents = ref<EventData[]>([]);

    constructor(selectedView: CalendarMode, selectedDay: CalendarDate) {
        this.refSelectedView.value = selectedView;
        this.selectedDay = selectedDay;
    }

    public get selectedView(): CalendarMode {
        return this.refSelectedView.value;
    }

    public set selectedView(mode: CalendarMode) {
        this.refSelectedView.value = mode;

        this.updateRelevantData();
    }

    public get selectedDay(): CalendarDate {
        return this.refSelectedDay.value;
    }

    public set selectedDay(date: CalendarDate) {
        this.refSelectedDay.value = date;

        const start = startOfWeek(date, CalendarData.localeString);
        const end = start.add({ days: 6 });

        this.refSelectedWeek.value = { start, end };

        this.updateRelevantData();
    }

    public get selectedWeek(): CalendarRange {
        return this.refSelectedWeek.value;
    }

    public get relevantEmployees(): Employee[] {
        return this.refRelevantEmployees.value;
    }

    public async getEventsForDate(date: CalendarDate): Promise<EventData[]> {
        const beginningOfDay = date.toDate(CalendarData.timeZone);
        const endOfDay = date.toDate(CalendarData.timeZone);
        beginningOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 99);

        let events: EventData[] = [];
        const business = Store.getBusiness();

        if (!business) return events;

        await ShiftServices.getAllInRangeForBusiness(business.id, beginningOfDay, endOfDay).then(
            (shifts) => {
                events = shifts.map((shift) => new ShiftEvent(shift));
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
        const business = Store.getBusiness();

        if (!business) return events;

        await ShiftServices.getAllInRangeForBusiness(business.id, startDate, endDate).then(
            (shifts) => {
                events = shifts.map((shift) => new ShiftEvent(shift));
            },
        );

        return events;
    }

    public async updateRelevantData() {
        this.refRelevantEvents.value = await this.updateRelevantEvents();
        this.refRelevantEmployees.value = await this.updateRelevantEmployees();
    }

    private async updateRelevantEvents(): Promise<EventData[]> {
        let relevantEvents: EventData[];

        if (this.selectedView === CalendarMode.Day) {
            const beginningOfDay = this.selectedDay.toDate(
                CalendarData.timeZone,
            );
            const endOfDay = this.selectedDay.toDate(CalendarData.timeZone);
            beginningOfDay.setHours(0, 0, 0, 0);
            endOfDay.setHours(24, 59, 59, 99);

            relevantEvents = await this.getEventsForDate(this.selectedDay);
        } else {
            relevantEvents = await this.getEventsInDateRange(
                this.selectedWeek.start,
                this.selectedWeek.end,
            );
        }

        return relevantEvents;
    }

    private async updateRelevantEmployees(): Promise<Employee[]> {
        let relevantEmployees: Employee[] = [];

        for (const event of this.refRelevantEvents.value) {
            if (!(event instanceof ShiftEvent)) continue;

            if (!event.shift.employee) continue;

            if (
                relevantEmployees.find(
                    (employee) => employee.id === event.shift.employee!.id,
                )
            )
                continue;

            relevantEmployees.push(event.shift.employee);
        }

        relevantEmployees = relevantEmployees.sort((e1, e2) => e1.id - e2.id);

        return relevantEmployees;
    }
}
