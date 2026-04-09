import { Shift } from "@classes/database/shift.ts";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "shifts";

export class ShiftServices {
    static async create(shift: Shift) {
        return await DatabaseServices.create<Shift>(Shift, API_ROOT, shift);
    }

    static async update(shift: Shift) {
        return await DatabaseServices.update<Shift>(Shift, API_ROOT, shift);
    }

    static async delete(shift: Shift) {
        return await DatabaseServices.delete(`${API_ROOT}/${shift.id}`);
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

    static async getAllInRangeForBusiness(
        businessID: number,
        startTime: Date,
        endTime: Date,
    ) {
        const startString = `${startTime.getMonth() + 1}-${startTime.getDate()}-${startTime.getFullYear()}-${startTime.getHours()}:${startTime.getMinutes()}`;
        const endString = `${endTime.getMonth() + 1}-${endTime.getDate()}-${endTime.getFullYear()}-${endTime.getHours()}:${endTime.getMinutes()}`;

        return await DatabaseServices.getAll<Shift>(
            Shift,
            `${API_ROOT}/business/${businessID}/startTime=${startString}/endTime=${endString}`,
        );
    }

    static async getAllInRangeForEmployee(
        employeeID: number,
        startTime: Date,
        endTime: Date,
    ) {
        const startString = `${startTime.getMonth() + 1}-${startTime.getDate()}-${startTime.getFullYear()}-${startTime.getHours()}:${startTime.getMinutes()}`;
        const endString = `${endTime.getMonth() + 1}-${endTime.getDate()}-${endTime.getFullYear()}-${endTime.getHours()}:${endTime.getMinutes()}`;

        return await DatabaseServices.getAll<Shift>(
            Shift,
            `${API_ROOT}/employee/${employeeID}/startTime=${startString}/endTime=${endString}`,
        );
    }
}
