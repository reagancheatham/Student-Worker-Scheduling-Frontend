import { Manager } from "@classes/database/manager";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "managers";

export class ManagerServices {
    static async create(manager: Manager) {
        await DatabaseServices.create(Manager, API_ROOT, manager);
    }

    static async update(manager: Manager) {
        await DatabaseServices.update(Manager, API_ROOT, manager);
    }

    static async delete(manager: Manager) {
        await DatabaseServices.delete(`${API_ROOT}/${manager.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<Manager>(
            Manager,
            `${API_ROOT}/${id}`,
        );
    }

    static async getAll() {
        return await DatabaseServices.getAll<Manager>(
            Manager,
            `${API_ROOT}`,
        );
    }

    static async getAllForBusiness(businessID: number) {
        return await DatabaseServices.getAll<Manager>(
            Manager,
            `${API_ROOT}/${businessID}`,
        );
    }
}
