import { Store } from "@classes/util/store/store.ts";
import { DatabaseModel } from "./databaseModel.ts";
import { Role } from "./role.ts";

export class Employee extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly businessID: number,
        public readonly studentID: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
        public roles: Role[] = [],
    ) {
        super();
    }

    public static async createInviteEmployee(
        email: string,
        isManager: boolean,
    ): Promise<Employee> {
        const business = await Store.businessStore.get();
        const businessID = business!.id;

        const employee = new Employee(0, businessID, "", "", "", email, "");
        (employee as any).isManager = isManager;

        return employee;
    }

    public static createFromData(data: any): Employee {
        const user = data["User"];
        const studentID = user ? user.studentID : ("" as string);
        const firstName = user ? user.firstName : ("" as string);
        const lastName = user ? user.lastName : ("" as string);
        const email = user ? user.email : ("" as string);
        const phoneNumber = user ? user.phoneNumber : ("" as string);
        const roles = data["Roles"] ? data["Roles"] : [];

        return new Employee(
            data["id"] ?? 0,
            data["businessID"] ?? 0,
            studentID,
            firstName,
            lastName,
            email,
            phoneNumber,
            roles,
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
