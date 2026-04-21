import { ShiftTaskListTemplateServices } from "../../services/shiftTaskListTemplateServices.ts";
import { DatabaseModel } from "./databaseModel.ts";
import { ScheduleShiftTemplate } from "./scheduleShiftTemplate.ts";
import { ShiftTaskTemplate } from "./shiftTaskTemplate.ts";
import { TaskList } from "./taskList.ts";

export class ShiftTaskListTemplate extends DatabaseModel {
    public constructor(
        public id: number,
        public scheduleShiftID: number,
        public name: string,
        public shiftTaskTemplates: ShiftTaskTemplate[],
    ) {
        super();
    }

    public static createFromData(data: any): ShiftTaskListTemplate {
        let tasksJSON = data["ShiftTaskTemplates"];
        let tasks: ShiftTaskTemplate[] = [];

        if (tasksJSON) {
            tasksJSON.forEach((taskJSON: any) => {
                tasks.push(ShiftTaskTemplate.createFromData(taskJSON));
            });
        }

        tasks.sort((a, b) => a.listOrder - b.listOrder);

        return new ShiftTaskListTemplate(
            data["id"] ?? 0,
            data["scheduleShiftID"] ?? 0,
            data["name"] ?? "Task List",
            tasks,
        );
    }

    public async updateBackend(
        shift: ScheduleShiftTemplate,
    ): Promise<ShiftTaskListTemplate> {
        if (this.id < 1) {
            this.scheduleShiftID = shift.id;
            const response = await ShiftTaskListTemplateServices.create(this);

            return response;
        } else {
            await ShiftTaskListTemplateServices.update(this);

            return this;
        }
    }

    public clone(): ShiftTaskListTemplate {
        return new ShiftTaskListTemplate(
            this.id,
            this.scheduleShiftID,
            this.name,
            [...this.shiftTaskTemplates],
        );
    }

    public toTaskList(): TaskList {
        const tasks = this.shiftTaskTemplates.map((t) => t.toTask());

        return new TaskList(0, 0, this.name, tasks);
    }
}
