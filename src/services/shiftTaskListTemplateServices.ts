import { ShiftTaskListTemplate } from "@classes/database/shiftTaskListTemplate.ts";
import { DatabaseServices } from "@classes/util/databaseServices.ts";

const API_ROOT: string = "shiftTaskListTemplates";

export class ShiftTaskListTemplateServices {
    static async create(taskList: ShiftTaskListTemplate) {
        return await DatabaseServices.create<ShiftTaskListTemplate>(ShiftTaskListTemplate, API_ROOT, taskList);
    }

    static async update(taskList: ShiftTaskListTemplate) {
        return await DatabaseServices.update<ShiftTaskListTemplate>(ShiftTaskListTemplate, API_ROOT, taskList);
    }

    static async delete(taskList: ShiftTaskListTemplate) {
        return await DatabaseServices.delete(`${API_ROOT}/${taskList.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<ShiftTaskListTemplate>(
            ShiftTaskListTemplate,
            `${API_ROOT}/${id}`,
        );
    }

    static async getOrCreateForShift(shiftID: number) {
        return await DatabaseServices.get<ShiftTaskListTemplate>(
            ShiftTaskListTemplate,
            `${API_ROOT}/shift/${shiftID}`,
        );
    }
}
