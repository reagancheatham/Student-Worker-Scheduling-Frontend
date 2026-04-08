import { Business } from "@classes/database/business";
import { DatabaseServices } from "@classes/util/databaseServices";
import { Store } from "@classes/util/store.ts";

const API_ROOT: string = "businesses";

export class BusinessServices {
    static async create(business: Business, email: string) {
        await DatabaseServices.create(Business, API_ROOT, { business, email });
    }

    static async update(business: Business, email: string) {
        await DatabaseServices.update(Business, API_ROOT, { business, email });
    }

    static async delete(business: Business) {
        await DatabaseServices.delete(`${API_ROOT}/${business.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<Business>(
            Business,
            `${API_ROOT}/${id}`,
        );
    }

    static async getAllForUser(id: number) {
        return await DatabaseServices.getAll<Business>(
            Business,
            `${API_ROOT}/users/${id}`,
        );
    }

    static async swapCurrentBusiness(businessID: number) {
        const newBusiness = await DatabaseServices.get<Business>(
            Business,
            `/businesses/${businessID}`,
        );

        Store.setBusiness(newBusiness);
    }
}
