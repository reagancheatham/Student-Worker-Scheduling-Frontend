import { DatabaseModel } from "./databaseModel.ts";
import { TaskTemplate } from "./taskTemplate.ts";
import { TaskListTemplateServices } from "../../services/taskListTemplateServices.ts";
import { Task } from "./task.ts";
import { ShiftTaskTemplate } from "./shiftTaskTemplate.ts";

export class TaskListTemplate extends DatabaseModel {
    public constructor(
        public readonly id: number,
        public businessID: number,
        public name: string,
        public tasks: TaskTemplate[],
    ) {
        super();
    }

    public static createFromData(data: any): TaskListTemplate {
        let tasksJSON = data["TaskTemplates"];
        let tasks: TaskTemplate[] = [];

        if (tasksJSON) {
            tasksJSON.forEach((taskJSON: any) => {
                tasks.push(TaskTemplate.createFromData(taskJSON));
            });
        }

        tasks.sort((a, b) => a.listOrder - b.listOrder);

        return new TaskListTemplate(
            data["id"] ?? 0,
            data["businessID"] ?? 0,
            data["name"] ?? 0,
            tasks,
        );
    }

    public async updateBackend(): Promise<TaskListTemplate> {
        if (this.id < 1) {
            const response = await TaskListTemplateServices.create(this);

            return response;
        } else {
            const response = await TaskListTemplateServices.update(this);

            return response;
        }
    }

    public toTasks(): Task[] {
        return this.tasks.map(
            (t) => new Task(0, 0, 0, t.name, t.description, []),
        );
    }

    public toShiftTemplateTasks(): ShiftTaskTemplate[] {
        return this.tasks.map(
            (t) => new ShiftTaskTemplate(0, 0, 0, t.name, t.description),
        );
    }
}
