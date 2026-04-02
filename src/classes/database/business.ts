import { ref } from "vue";
import { Employee } from "./employee.ts";
import { EmployeeServices } from "../../services/employeeServices.ts";
import { DatabaseModel } from "./databaseModel.ts";

export class Business extends DatabaseModel{
    public static current = new Business(1, "My Business");

    constructor(
        public readonly id: number,
        public readonly name: string,
    ) {
        super();
    }

    public static createFromData(data: any): Business {
            return new Business(
                data["id"] ?? 0,
                data["name"] ?? "",
            );
        }
}
