import { DatabaseModel } from "./databaseModel.ts";

export class Employee extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        public readonly phoneNumber: string,
    ) {
        super();
    }

    public static createFromData(data: any): Employee {
        let user = data["User"];
        let firstName = user ? user.firstName : ("" as string);
        let lastName = user ? user.lastName : ("" as string);
        let email = user ? user.email : ("" as string);
        let phoneNumber = user ? user.phoneNumber : ("" as string);

        return new Employee(
            data["id"] ?? 0,
            firstName,
            lastName,
            email,
            phoneNumber,
        );
    }
}
