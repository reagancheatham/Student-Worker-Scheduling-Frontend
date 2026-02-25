import { Employee } from "@classes/Employee";
import { servicesUtil } from "@classes/util/servicesUtil";
import { apiClient } from "./services";

const API_ROOT: string = "employee";

//TODO: CREATE PATHS FOR EACH GENERIC AND BUILD GET AND GETALL
export class EmployeeServices {

    static async create(employee: Employee) {
        await servicesUtil.create(API_ROOT, employee);
    };

    static async update(employee: Employee) {
        await servicesUtil.update(API_ROOT, employee);
    };

    static async delete(employee: Employee) {
        await servicesUtil.delete(`${API_ROOT}/:${employee.id}`);
    };

    static async get(id: number) {
        let employee: Employee;

        await apiClient 
            .get(`${API_ROOT}/:${id}`)
            .then((response) => {
                employee = new Employee(
                    response.data.id,
                    response.data.name,
                    response.data.email
                );

                console.log(`Successfully got employee of id: ${id}`);
            })
            .catch((err) => {
                console.log(`Error getting Employee with an id of: ${id} ` + err);
            });

        return employee;
    };

    static async getAllForBusiness(businessId: number) {
        //biz id might be stored in the store... adjust later maybe...
        let results: Employee[] = [];

        await apiClient
            .get(`${API_ROOT}/:${businessId}`)
            .then((response) => {
                results = response.data.map((d) =>{
                    d.id,
                    d.name,
                    d.email
                });
            })
            .catch((err) => {
                console.log(`Error getting all Employees for bussines ${businessId} ` + err);
            });
    };
}

