import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { EventData } from "./eventData.ts";
import { ShiftTemplateEventData } from "./shiftTemplateEventData.ts";
import { ScheduleShiftTemplateServices } from "../../services/scheduleShiftTemplateServices.ts";

export class TemplateCalendarData {
    public readonly selectedTemplate: ScheduleTemplate;

    constructor(selectedTemplate: ScheduleTemplate) {
        this.selectedTemplate = selectedTemplate;
    }

    public async getEventsForTemplate(): Promise<EventData[]> {
        if (!this.selectedTemplate || this.selectedTemplate.id === 0) return [];

        let events: EventData[] = [];
        const shiftTemplates =
            await ScheduleShiftTemplateServices.getAllForScheduleTemplate(
                this.selectedTemplate.id,
            );

        events = shiftTemplates.map(
            (template) => new ShiftTemplateEventData(template),
        );

        return events;
    }
}
