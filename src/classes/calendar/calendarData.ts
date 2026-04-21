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
import { ShiftEventData } from "./shiftEventData.ts";
import { Employee } from "@classes/database/employee.ts";
import { en } from "@nuxt/ui/runtime/locale/index.js";
import { Store } from "@classes/util/store/store.ts";
import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { ShiftTemplateEventData } from "./shiftTemplateEventData.ts";
import { TemplateCalendarData } from "./templateCalendarData.ts";
import { WeekDay } from "@classes/util/weekDay.ts";

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
    private readonly refTemplateData = ref<TemplateCalendarData>();
    private readonly refHasUnassignedShift = ref(false);
    private readonly refHasValidUnpublishedShift = ref(false);

    constructor(
        selectedView: CalendarMode,
        selectedDay: CalendarDate,
        selectedTemplate?: ScheduleTemplate,
    ) {
        if (selectedTemplate)
            this.refTemplateData.value = new TemplateCalendarData(
                selectedTemplate,
            );

        this.refSelectedView.value = selectedView;
        this.selectedDay = selectedDay;
    }

    public static create(
        selectedView: CalendarMode,
        selectedDay: CalendarDate,
    ): CalendarData {
        return new CalendarData(selectedView, selectedDay);
    }

    public static createTemplate(
        selectedView: CalendarMode,
        selectedTemplate: ScheduleTemplate,
    ): CalendarData {
        return new CalendarData(
            selectedView,
            today(CalendarData.timeZone),
            selectedTemplate,
        );
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

        if (!this.isTemplate) this.updateRelevantData();
    }

    public get selectedTemplateDay(): WeekDay | undefined {
        return this.templateData?.selectedDay;
    }

    public set selectedTemplateDay(day: WeekDay) {
        if (!this.templateData) return;

        this.templateData.selectedDay = day;
        this.updateRelevantData();
    }

    public get selectedWeek(): CalendarRange {
        return this.refSelectedWeek.value;
    }

    public get relevantEmployees(): Employee[] {
        return this.refRelevantEmployees.value;
    }

    public get selectedTemplate(): ScheduleTemplate | undefined {
        return this.refTemplateData.value?.selectedTemplate;
    }

    public get isTemplate(): boolean {
        return this.refTemplateData.value !== undefined;
    }

    public get templateData(): TemplateCalendarData | undefined {
        return this.refTemplateData.value;
    }

    public get hasUnassignedShift(): boolean {
        return this.refHasUnassignedShift.value;
    }

    public get hasValidUnpublishedShift(): boolean {
        return this.refHasValidUnpublishedShift.value;
    }

    public async updateRelevantData() {
        this.refRelevantEvents.value = await this.updateRelevantEvents();
        this.refRelevantEmployees.value = await this.updateRelevantEmployees();
    }

    private async updateRelevantEvents(): Promise<EventData[]> {
        let relevantEvents: EventData[];

        if (this.isTemplate)
            relevantEvents =
                await this.refTemplateData.value!.getEventsForTemplate(
                    this.selectedView,
                );
        else if (this.selectedView === CalendarMode.Day) {
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

        let unassignedShift = false;
        let unpublishedShift = false;

        for (let i = 0; i < relevantEvents.length; i++) {
            if (unassignedShift && unpublishedShift) break;

            const event = relevantEvents[i];

            if (event instanceof ShiftEventData) {
                if (!event.shift.employee) unassignedShift = true;
                else if (!event.shift.published) unpublishedShift = true;
            } else if (
                event instanceof ShiftTemplateEventData &&
                !event.template.employee
            )
                unassignedShift = true;
        }

        this.refHasUnassignedShift.value = unassignedShift;
        this.refHasValidUnpublishedShift.value = unpublishedShift;

        return relevantEvents;
    }

    private async getEventsForDate(date: CalendarDate): Promise<EventData[]> {
        const beginningOfDay = date.toDate(CalendarData.timeZone);
        const endOfDay = date.toDate(CalendarData.timeZone);
        beginningOfDay.setHours(0, 0, 0, 0);
        endOfDay.setHours(23, 59, 59, 99);

        let events: EventData[] = [];
        const business = await Store.businessStore.get();

        if (!business) {
            events = [];
            return events;
        }

        await ShiftServices.getAllInRangeForBusiness(
            business.id,
            beginningOfDay,
            endOfDay,
        ).then((shifts) => {
            events = shifts.map((shift) => new ShiftEventData(shift));
        });

        return events;
    }

    private async getEventsInDateRange(
        start: CalendarDate,
        end: CalendarDate,
    ): Promise<EventData[]> {
        const startDate = start.toDate(CalendarData.timeZone);
        const endDate = end.toDate(CalendarData.timeZone);

        endDate.setHours(23, 59, 59, 99);

        let events: EventData[] = [];
        const business = await Store.businessStore.get();

        if (!business) {
            events = [];
            return events;
        }

        await ShiftServices.getAllInRangeForBusiness(
            business.id,
            startDate,
            endDate,
        ).then((shifts) => {
            events = shifts.map((shift) => new ShiftEventData(shift));
        });

        return events;
    }

    private async updateRelevantEmployees(): Promise<Employee[]> {
        let relevantEmployees: Employee[] = [];

        for (const event of this.refRelevantEvents.value) {
            let employee;

            if (event instanceof ShiftEventData)
                employee = event.shift.employee;
            else if (event instanceof ShiftTemplateEventData)
                employee = event.template.employee;

            if (!employee) continue;

            if (relevantEmployees.find((e) => e.id === employee.id)) continue;

            relevantEmployees.push(employee);
        }

        relevantEmployees = relevantEmployees.sort((e1, e2) => e1.id - e2.id);

        return relevantEmployees;
    }
}
