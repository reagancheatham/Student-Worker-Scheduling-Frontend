import { ref } from "vue";
import { Employee } from "./employee.ts";
import { EmployeeServices } from "../../services/employeeServices.ts";
import { DatabaseModel } from "./databaseModel.ts";

export class Business extends DatabaseModel {
    public refEmployees = ref<Employee[]>([]);

    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly owner: Employee,
    ) {
        super();

        EmployeeServices.getAllForBusiness(id).then(
            (employees) => (this.refEmployees.value = employees),
        );
    }

    public static createFromData(data: any): Business {
        let id = data["id"];
        let name = data["name"];
        console.log(data);
        let employee = Employee.createFromData(data["Managers"][0].Employee);

        return new Business(id, name, employee);
    }
}
