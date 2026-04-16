import { ShiftTaskListTemplateServices } from "../../services/shiftTaskListTemplateServices.ts";
import { DatabaseModel } from "./databaseModel.ts";
import { ScheduleShiftTemplate } from "./scheduleShiftTemplate.ts";
import { ShiftTaskTemplate } from "./shiftTaskTemplate.ts";

export class ShiftTaskListTemplate extends DatabaseModel {
    public constructor(
        public readonly id: number,
        public scheduleShiftID: number,
        public readonly name: string,
        public tasks: ShiftTaskTemplate[],
    ) {
        super();
    }

    public static createFromData(data: any): ShiftTaskListTemplate {
        let tasksJSON = data["Tasks"];
        let tasks: ShiftTaskTemplate[] = [];

        if (tasksJSON) {
            tasksJSON.forEach((taskJSON: any) => {
                tasks.push(ShiftTaskTemplate.createFromData(taskJSON));
            });
        }

        tasks.sort((a, b) => a.listOrder - b.listOrder);

        return new ShiftTaskListTemplate(
            data["id"] ?? 0,
            data["shiftID"] ?? 0,
            data["name"] ?? 0,
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
            const response = await ShiftTaskListTemplateServices.update(this);

            return response;
        }
    }
}
