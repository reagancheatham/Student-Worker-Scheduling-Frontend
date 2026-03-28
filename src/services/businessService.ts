import { Business } from "@classes/database/business";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "businesses";

export class BusinessServices {
    static async create(business: Business) {
        await DatabaseServices.create(Business, API_ROOT, business);
    }

    static async update(business: Business) {
        await DatabaseServices.update(Business, API_ROOT, business);
    }

    static async delete(business: Business): Promise<void>;
    static async delete(id: number): Promise<void>;

    static async delete(business: Business | number) {
        const id = typeof business === 'number'
            ? business
            : business.id;
        DatabaseServices.delete(`${API_ROOT}/${id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<Business>(
            Business,
            `${API_ROOT}/${id}`,
        );
    }

    static async getAll() {
        return await DatabaseServices.getAll<Business>(
            Business,
            `${API_ROOT}`,
        );
    }
}
