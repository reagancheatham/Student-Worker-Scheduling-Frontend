import { TaskListTemplate } from "@classes/database/taskListTemplate.ts";
import { DatabaseServices } from "@classes/util/databaseServices.ts";

const API_ROOT: string = "taskListTemplates";

export class TaskListTemplateServices {
    static async create(taskList: TaskListTemplate) {
        return await DatabaseServices.create<TaskListTemplate>(
            TaskListTemplate,
            API_ROOT,
            taskList,
        );
    }

    static async update(taskList: TaskListTemplate) {
        return await DatabaseServices.update<TaskListTemplate>(
            TaskListTemplate,
            API_ROOT,
            taskList,
        );
    }

    static async delete(taskList: TaskListTemplate) {
        return await DatabaseServices.delete(`${API_ROOT}/${taskList.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<TaskListTemplate>(
            TaskListTemplate,
            `${API_ROOT}/${id}`,
        );
    }

    static async getAllForBusiness(businessID: number) {
        return await DatabaseServices.getAll<TaskListTemplate>(
            TaskListTemplate,
            `${API_ROOT}/business/${businessID}`,
        );
    }
}
