import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { Shift } from "@classes/database/shift.ts";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "scheduleTemplates";

export class ScheduleTemplateServices {
    static async create(template: ScheduleTemplate) {
        return await DatabaseServices.create<ScheduleTemplate>(
            Shift,
            API_ROOT,
            template,
        );
    }

    static async update(template: ScheduleTemplate) {
        return await DatabaseServices.update<ScheduleTemplate>(
            Shift,
            API_ROOT,
            template,
        );
    }

    static async delete(template: ScheduleTemplate) {
        return await DatabaseServices.delete(`${API_ROOT}/${template.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<ScheduleTemplate>(
            Shift,
            `${API_ROOT}/${id}`,
        );
    }

    static async getAllForBusiness(businessID: number) {
        return await DatabaseServices.getAll<ScheduleTemplate>(
            ScheduleTemplate,
            `${API_ROOT}/business/${businessID}`,
        );
    }
}
