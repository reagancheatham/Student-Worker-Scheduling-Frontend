import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { EventData } from "./eventData.ts";
import { ShiftTemplateEventData } from "./shiftTemplateEventData.ts";
import { ScheduleShiftTemplateServices } from "../../services/scheduleShiftTemplateServices.ts";
import { WeekDay } from "@classes/util/weekDay.ts";
import { CalendarMode } from "./calendarMode.ts";
import { reactive } from "vue";

export class TemplateCalendarData {
    public readonly selectedTemplate: ScheduleTemplate;
    public selectedDay: WeekDay = WeekDay.Sunday;

    constructor(selectedTemplate: ScheduleTemplate) {
        this.selectedTemplate = selectedTemplate;
    }

    public async getEventsForTemplate(
        mode: CalendarMode,
    ): Promise<EventData[]> {
        if (!this.selectedTemplate || this.selectedTemplate.id === 0) return [];

        let events: EventData[] = [];
        const shiftTemplates =
            await ScheduleShiftTemplateServices.getAllForScheduleTemplate(
                this.selectedTemplate.id,
            );

        if (mode === CalendarMode.Day)
            events = shiftTemplates
                .filter((template) => {
                    return template.weekDay === this.selectedDay;
                })
                .map((template) =>
                    reactive(new ShiftTemplateEventData(template)),
                );
        else
            events = shiftTemplates.map((template) =>
                reactive(new ShiftTemplateEventData(template)),
            );

        return events;
    }
}
