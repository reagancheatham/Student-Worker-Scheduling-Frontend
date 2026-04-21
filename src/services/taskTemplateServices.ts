import { TaskTemplate } from "@classes/database/taskTemplate.ts";
import { DatabaseServices } from "@classes/util/databaseServices.ts";

const API_ROOT: string = "taskTemplates";

export class TaskTemplateServices {
    public static async create(task: TaskTemplate): Promise<TaskTemplate> {
        return await DatabaseServices.create<TaskTemplate>(
            TaskTemplate,
            API_ROOT,
            task,
        );
    }

    public static async update(task: TaskTemplate): Promise<TaskTemplate> {
        return await DatabaseServices.update<TaskTemplate>(
            TaskTemplate,
            API_ROOT,
            task,
        );
    }

    public static async delete(task: TaskTemplate): Promise<void> {
        return await DatabaseServices.delete(`${API_ROOT}/${task.id}`);
    }

    public static async get(id: number): Promise<TaskTemplate> {
        return await DatabaseServices.get<TaskTemplate>(
            TaskTemplate,
            `${API_ROOT}/${id}`,
        );
    }

    public static async getAllForList(
        taskListID: number,
    ): Promise<TaskTemplate[]> {
        return await DatabaseServices.getAll<TaskTemplate>(
            TaskTemplate,
            `${API_ROOT}/templateTaskList/${taskListID}`,
        );
    }
}
