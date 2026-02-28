import { Shift } from "@classes/database/shift.ts";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "employees";

export class ShiftServices {
    static async create(employee: Shift) {
        await DatabaseServices.create(API_ROOT, employee);
    }

    static async update(employee: Shift) {
        await DatabaseServices.update(API_ROOT, employee);
    }

    static async delete(employee: Shift) {
        await DatabaseServices.delete(`${API_ROOT}/${employee.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<Shift>(Shift, `${API_ROOT}/${id}`);
    }

    static async getAllForBusiness(businessID: number) {
        return await DatabaseServices.getAll<Shift>(
            Shift,
            `${API_ROOT}/business/${businessID}`,
        );
    }

    static async getAllInRange(
        businessID: number,
        startTime: Date,
        endTime: Date,
    ) {
        return await DatabaseServices.getAll<Shift>(
            Shift,
            `${API_ROOT}/${businessID}/startTime>=${startTime}/endTime<=${endTime}`,
        );
    }
}
