import { TaskList } from "@classes/database/taskList.ts";
import { DatabaseServices } from "@classes/util/databaseServices.ts";

const API_ROOT: string = "taskLists";

export class TaskListServices {
    static async create(taskList: TaskList) {
        return await DatabaseServices.create(TaskList, API_ROOT, taskList);
    }

    static async update(taskList: TaskList) {
        return await DatabaseServices.update(TaskList, API_ROOT, taskList);
    }

    static async delete(taskList: TaskList) {
        return await DatabaseServices.delete(`${API_ROOT}/${taskList.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<TaskList>(
            TaskList,
            `${API_ROOT}/${id}`,
        );
    }

    static async getOrCreateForShift(shiftID: number) {
        return await DatabaseServices.get<TaskList>(
            TaskList,
            `${API_ROOT}/shift/${shiftID}`,
        );
    }
}
