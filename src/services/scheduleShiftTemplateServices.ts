import { ScheduleShiftTemplate } from "@classes/database/scheduleShiftTemplate.ts";
import { Shift } from "@classes/database/shift.ts";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "scheduleShiftTemplates";

export class ScheduleShiftTemplateServices {
    static async create(template: ScheduleShiftTemplate) {
        return await DatabaseServices.create<ScheduleShiftTemplate>(
            Shift,
            API_ROOT,
            template,
        );
    }

    static async update(template: ScheduleShiftTemplate) {
        return await DatabaseServices.update<ScheduleShiftTemplate>(
            Shift,
            API_ROOT,
            template,
        );
    }

    static async delete(template: ScheduleShiftTemplate) {
        return await DatabaseServices.delete(`${API_ROOT}/${template.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<ScheduleShiftTemplate>(
            Shift,
            `${API_ROOT}/${id}`,
        );
    }

    static async getAllForScheduleTemplate(scheduleTemplateID: number) {
        return await DatabaseServices.getAll<ScheduleShiftTemplate>(
            ScheduleShiftTemplate,
            `${API_ROOT}/template/${scheduleTemplateID}`,
        );
    }
}
