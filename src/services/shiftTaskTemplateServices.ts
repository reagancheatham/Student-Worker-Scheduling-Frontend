import { ShiftTaskTemplate } from "@classes/database/shiftTaskTemplate.ts";
import { DatabaseServices } from "@classes/util/databaseServices.ts";

const API_ROOT: string = "shiftTaskTemplates";

export class ShiftTaskTemplateServices {
    public static async create(
        task: ShiftTaskTemplate,
    ): Promise<ShiftTaskTemplate> {
        return await DatabaseServices.create<ShiftTaskTemplate>(
            ShiftTaskTemplate,
            API_ROOT,
            task,
        );
    }

    public static async update(
        task: ShiftTaskTemplate,
    ): Promise<ShiftTaskTemplate> {
        return await DatabaseServices.update<ShiftTaskTemplate>(
            ShiftTaskTemplate,
            API_ROOT,
            task,
        );
    }

    public static async delete(task: ShiftTaskTemplate): Promise<void> {
        return await DatabaseServices.delete(`${API_ROOT}/${task.id}`);
    }

    public static async get(id: number): Promise<ShiftTaskTemplate> {
        return await DatabaseServices.get<ShiftTaskTemplate>(
            ShiftTaskTemplate,
            `${API_ROOT}/${id}`,
        );
    }

    public static async getAllForList(
        taskListID: number,
    ): Promise<ShiftTaskTemplate[]> {
        return await DatabaseServices.getAll<ShiftTaskTemplate>(
            ShiftTaskTemplate,
            `${API_ROOT}/shiftTaskList/${taskListID}`,
        );
    }
}
