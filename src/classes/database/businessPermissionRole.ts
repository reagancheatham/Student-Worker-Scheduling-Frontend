import { DatabaseModel } from "./databaseModel.ts";

export class BusinessPermissionRole extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly name: string,
    ) {
        super();
    }

    public static createFromData(data: any): BusinessPermissionRole {
        return new BusinessPermissionRole(data["id"] ?? 0, data["name"] ?? "");
    }
}
