import { DatabaseModel } from "./databaseModel.ts";

export class ShiftTaskTemplate extends DatabaseModel {
    public constructor(
        public readonly id: number,
        public readonly shiftTaskListID: number,
        public listOrder: number,
        public name: string,
        public description: string,
    ) {
        super();
    }

    public static createFromData(data: any): ShiftTaskTemplate {
        return new ShiftTaskTemplate(
            data["id"] ?? 0,
            data["shiftTaskListID"] ?? 0,
            data["listOrder"] ?? 0,
            data["name"] ?? 0,
            data["description"] ?? "",
        );
    }

    public isValid(): boolean {
        return this.id > 0;
    }
}
