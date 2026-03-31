import { Task } from "@classes/database/task.ts";
import { DatabaseServices } from "@classes/util/databaseServices.ts";

const API_ROOT: string = "tasks";

export class TaskServices {
    static async create(task: Task) {
        return await DatabaseServices.create(Task, API_ROOT, task);
    }

    static async update(task: Task) {
        return await DatabaseServices.update(Task, API_ROOT, task);
    }

    static async delete(task: Task) {
        return await DatabaseServices.delete(`${API_ROOT}/${task.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<Task>(Task, `${API_ROOT}/${id}`);
    }

    static async getAllForList(taskListID: number) {
        return await DatabaseServices.getAll<Task>(
            Task,
            `${API_ROOT}/taskList/${taskListID}`,
        );
    }
}
