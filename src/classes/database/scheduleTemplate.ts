import { DatabaseModel } from "./databaseModel.ts";

export class ScheduleTemplate extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly businessID: number,
        public name: string,
    ) {
        super();
    }

    public static createFromData(data: any): ScheduleTemplate {
        return new ScheduleTemplate(
            data["id"] ?? 0,
            data["businessID"] ?? 0,
            data["name"] ?? 0,
        );
    }
}
