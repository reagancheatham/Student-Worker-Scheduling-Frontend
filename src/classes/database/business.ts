import { ref } from "vue";
import { Employee } from "./employee.ts";
import { EmployeeServices } from "../../services/employeeServices.ts";

export class Business {
    public static current = new Business(1, "My Business");

    public refEmployees = ref<Employee[]>([]);

    constructor(
        public readonly id: number,
        public readonly name: string,
    ) {
        EmployeeServices.getAllForBusiness(id).then(
            (employees) => (this.refEmployees.value = employees),
        );
    }
}
