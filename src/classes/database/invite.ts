import { Business } from "./business.ts";
import { BusinessPermissionRole } from "./businessPermissionRole.ts";
import { DatabaseModel } from "./databaseModel.ts";

export class Invite extends DatabaseModel {
    constructor(
        public readonly code: number,
        public readonly email: string,
        public readonly business: Business | undefined,
        public readonly businessPermissionRole: BusinessPermissionRole | undefined
    ) {
        super();
    }

    public static createFromData(data: any): Invite {
        const business = data["Business"]
                    ? Business.create(data["Business"])
                    : undefined;
        const businessPermissionRole = data["BusinessPermissionRole"]
                    ? BusinessPermissionRole.create(data["BusinessPermissionRole"])
                    : undefined;

        return new Invite(
            data["code"] ?? 0,
            data["email"] ?? "",
            business,
            businessPermissionRole
        );
    }
}
