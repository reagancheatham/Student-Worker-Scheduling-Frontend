import { DatabaseModel } from "./databaseModel.ts";
import { TaskCheckOff } from "./taskCheckOff.ts";

export class Task extends DatabaseModel {
    public constructor(
        public readonly id: number,
        public taskListID: number,
        public listOrder: number,
        public name: string,
        public description: string,
        public checkOffs: TaskCheckOff[],
    ) {
        super();
    }

    public static createFromData(data: any): Task {
        let checkOffsJSON = data["TaskCheckOffs"];
        let checkOffs: TaskCheckOff[] = [];

        if (checkOffsJSON) {
            checkOffsJSON.forEach((checkOffJSON: any) => {
                checkOffs.push(TaskCheckOff.createFromData(checkOffJSON));
            });
        }

        return new Task(
            data["id"] ?? 0,
            data["taskListID"] ?? 0,
            data["listOrder"] ?? 0,
            data["name"] ?? 0,
            data["description"] ?? "",
            checkOffs,
        );
    }

    public isValid(): boolean {
        return this.id > 0;
    }
}
