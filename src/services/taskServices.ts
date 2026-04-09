import { Task } from "@classes/database/task.ts";
import { TaskCheckOff } from "@classes/database/taskCheckOff.ts";
import { DatabaseServices } from "@classes/util/databaseServices.ts";

const API_ROOT: string = "tasks";

export class TaskServices {
    public static async create(task: Task): Promise<Task> {
        return await DatabaseServices.create<Task>(Task, API_ROOT, task);
    }

    public static async update(task: Task): Promise<Task> {
        return await DatabaseServices.update<Task>(Task, API_ROOT, task);
    }

    public static async delete(task: Task): Promise<void> {
        return await DatabaseServices.delete(`${API_ROOT}/${task.id}`);
    }

    public static async get(id: number): Promise<Task> {
        return await DatabaseServices.get<Task>(Task, `${API_ROOT}/${id}`);
    }

    public static async getAllForList(taskListID: number): Promise<Task[]> {
        return await DatabaseServices.getAll<Task>(
            Task,
            `${API_ROOT}/taskList/${taskListID}`,
        );
    }

    public static async getCheckOffs(task: Task): Promise<TaskCheckOff[]> {
        return await DatabaseServices.getAll<TaskCheckOff>(
            TaskCheckOff,
            `taskCheckOffs/task/${task.id}`,
        );
    }

    public static async createCheckOff(
        checkOff: TaskCheckOff,
    ): Promise<TaskCheckOff> {
        return await DatabaseServices.create<TaskCheckOff>(
            TaskCheckOff,
            `taskCheckOffs`,
            checkOff,
        );
    }

    public static async deleteCheckOff(checkOff: TaskCheckOff): Promise<void> {
        return await DatabaseServices.delete(`taskCheckOffs/${checkOff.id}`);
    }
}
