import { DatabaseModel } from "./databaseModel.ts";

export class Employee extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly studentID: string,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
    ) {
        super();
    }

    public static createFromData(data: any): Employee {
        console.log("Data: " + JSON.stringify(data));

        let user = data["User"];
        let studentID = user ? user.studentID : ("" as string);
        let firstName = user ? user.firstName : ("" as string);
        let lastName = user ? user.lastName : ("" as string);
        let email = user ? user.email : ("" as string);
        let phoneNumber = user ? user.phoneNumber : ("" as string);

        return new Employee(
            data["id"] ?? 0,
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

        return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
}
