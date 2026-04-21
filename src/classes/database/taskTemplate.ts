import { DatabaseModel } from "./databaseModel.ts";

export class TaskTemplate extends DatabaseModel {
    public constructor(
        public readonly id: number,
        public readonly taskListTemplateID: number,
        public listOrder: number,
        public name: string,
        public description: string,
    ) {
        super();
    }

    public static createFromData(data: any): TaskTemplate {
        return new TaskTemplate(
            data["id"] ?? 0,
            data["taskListID"] ?? 0,
            data["listOrder"] ?? 0,
            data["name"] ?? 0,
            data["description"] ?? "",
        );
    }

    public isValid(): boolean {
        return this.id > 0;
    }
}
