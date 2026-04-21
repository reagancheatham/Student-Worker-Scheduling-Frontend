class PermissionRole {
    public constructor(public readonly id: number, public readonly name: string) {}
}

export const User = new PermissionRole(1, "User");
export const Admin = new PermissionRole(2, "Admin");