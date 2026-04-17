import { EventData } from "./eventData.ts";
import { EventTime } from "./eventTime.ts";
import { ScheduleShiftTemplate } from "@classes/database/scheduleShiftTemplate.ts";
import { ScheduleShiftTemplateServices } from "../../services/scheduleShiftTemplateServices.ts";
import { fromWeekIndex, toWeekIndex } from "@classes/util/weekDay.ts";

export class ShiftTemplateEventData extends EventData {
    constructor(public readonly template: ScheduleShiftTemplate) {
        super(
            template.name,
            EventTime.fromDate(template.startTime),
            EventTime.fromDate(template.endTime),
            template.color,
        );

        this.templateStartDay = toWeekIndex(template.weekDay);
        this.templateEndDay = toWeekIndex(template.weekDay);
    }

    public override async updateBackend(): Promise<ScheduleShiftTemplate> {
        this.template.name = this.name;
        this.template.startTime = this.startTime.toDate();
        this.template.endTime = this.endTime.toDate();
        this.template.color = this.color;
        this.template.weekDay = fromWeekIndex(this.templateStartDay);

        let updatedShift: ScheduleShiftTemplate = this.template;

        if (this.template.isValid())
            await ScheduleShiftTemplateServices.update(this.template);
        else
            updatedShift = await ScheduleShiftTemplateServices.create(
                this.template,
            );

        const taskList =
            await this.template.taskList.updateBackend(updatedShift);

        this.template.taskList = taskList;

        return updatedShift;
    }

    public override async destroy(): Promise<void> {
        if (!this.template.isValid()) return;

        return ScheduleShiftTemplateServices.delete(this.template);
    }

    public override isValid(): boolean {
        return this.template.isValid();
    }
}
