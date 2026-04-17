import { Business } from "./business.ts";
import { Employee } from "./employee.ts";

export class Owner {
    public constructor(
        public readonly employee: Employee,
        public readonly business: Business,
    ) {}
}
