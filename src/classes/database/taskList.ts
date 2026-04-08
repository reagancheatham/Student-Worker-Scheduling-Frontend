import { DatabaseModel } from "./databaseModel.ts";
import { Task } from "./task.ts";
import { Shift } from "./shift.ts";
import { TaskListServices } from "../../services/taskListServices.ts";

export class TaskList extends DatabaseModel {
    public constructor(
        public readonly id: number,
        public shiftID: number,
        public readonly name: string,
        public readonly tasks: Task[],
    ) {
        super();
    }

    public static createFromData(data: any): TaskList {
        let tasksJSON = data["Tasks"];
        let tasks = [];

        if (tasksJSON) {
            tasksJSON.forEach((taskJSON: any) => {
                tasks.push(Task.createFromData(taskJSON));
            });
        }

        return new TaskList(
            data["id"] ?? 0,
            data["shiftID"] ?? 0,
            data["name"] ?? 0,
            tasks,
        );
    }

    public async updateBackend(shift: Shift) : Promise<TaskList> {
        if (this.id < 1) {
            this.shiftID = shift.id;
            const response = await TaskListServices.create(this);

            return response;
        }
        else
        {
            const response = await TaskListServices.update(this);

            return response;
        }
    }
}
