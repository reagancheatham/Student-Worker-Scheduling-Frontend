import { ref, Ref } from "vue";
import { DatabaseModel } from "./databaseModel.ts";
import { Task } from "./task.ts";

export class TaskList extends DatabaseModel {
    public constructor(
        public readonly id: number,
        public readonly shiftID: number,
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
}
