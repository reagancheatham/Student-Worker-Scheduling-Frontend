import { EventData } from "./eventData.ts";
import { EventTime } from "./eventTime.ts";
import { ScheduleShiftTemplate } from "@classes/database/scheduleShiftTemplate.ts";
import { ScheduleShiftTemplateServices } from "../../services/scheduleShiftTemplateServices.ts";

export class ShiftTemplateEventData extends EventData {
    constructor(public readonly template: ScheduleShiftTemplate) {
        super(
            template.name,
            EventTime.fromDate(template.startTime),
            EventTime.fromDate(template.endTime),
            template.color,
        );
    }

    public async updateBackend(): Promise<ScheduleShiftTemplate> {
        this.template.name = this.name;
        this.template.startTime = this.startTime.toDate();
        this.template.endTime = this.endTime.toDate();
        this.template.color = this.color;

        if (this.template.isValid())
            return ScheduleShiftTemplateServices.update(this.template);
        else return ScheduleShiftTemplateServices.create(this.template);
    }

    public async destroy() {
        if (!this.template.isValid()) return;

        return ScheduleShiftTemplateServices.delete(this.template);
    }
}
