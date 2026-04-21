import { DatabaseModel } from "./databaseModel.ts";

export class User extends DatabaseModel {
    constructor(
        public id: number,
        public studentID: number,
        public permissionRoleID: number,
        public firstName: string,
        public lastName: string,
        public email: string,
        public phoneNumber: string,
        public token?: string,
        public profilePicture?: string,
    ) {
        super();
    }

    public static createFromData(data: any): User {
        return new User(
            data["id"] ?? 0,
            data["studentID"] ?? 0,
            data["permissionRoleID"] ?? 0,
            data["firstName"] ?? "",
            data["lastName"] ?? "",
            data["email"] ?? "",
            data["phoneNumber"] ?? "",
        );
    }

    public get fullName(): string {
        return `${this.firstName} ${this.lastName}`;
    }

    public get formattedPhoneNumber(): string {
        const match = this.phoneNumber.match(/^(\d{3})(\d{3})(\d{4})$/)!;

        if (!match) return "";

        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
}
