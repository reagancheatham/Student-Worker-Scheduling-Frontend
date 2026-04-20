import { DatabaseModel } from "./databaseModel.ts";

export class Role extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly businessID: number,
        public name: string,
    ) {
        super();
    }

    public static createFromData(data: any): Role {
        return new Role(
            data["id"] ?? 0,
            data["businessID"] ?? 0,
            data["name"] ?? "New Role",
        );
    }
}
