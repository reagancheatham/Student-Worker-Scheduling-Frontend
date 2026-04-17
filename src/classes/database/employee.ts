import { Store } from "@classes/util/store.ts";
import { DatabaseModel } from "./databaseModel.ts";

export class Employee extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly businessID: number,
        public readonly studentID: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
    ) {
        super();
    }

    public static async createInviteEmployee(
        email: string,
        isManager: boolean,
    ): Promise<Employee> {
        const business = await Store.getBusiness();
        const businessID = business!.id;

        const employee = new Employee(0, businessID, "", "", "", email, "");
        (employee as any).isManager = isManager;
        
        return employee;
    }

    public static createFromData(data: any): Employee {
        let user = data["User"];
        let studentID = user ? user.studentID : ("" as string);
        let firstName = user ? user.firstName : ("" as string);
        let lastName = user ? user.lastName : ("" as string);
        let email = user ? user.email : ("" as string);
        let phoneNumber = user ? user.phoneNumber : ("" as string);

        return new Employee(
            data["id"] ?? 0,
            data["businessID"] ?? 0,
            studentID,
            firstName,
            lastName,
            email,
            phoneNumber,
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
