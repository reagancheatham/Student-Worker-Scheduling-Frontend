import { DatabaseModel } from "./databaseModel.ts";

export class PermissionRole extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly name: string,
    ) {
        super();
    }

    public static createFromData(data: any): PermissionRole {
        return new PermissionRole(data["id"] ?? 0, data["name"] ?? "");
    }
}
