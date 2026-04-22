import { Business } from "@classes/database/business";
import { DatabaseServices } from "@classes/util/databaseServices";
import { Store } from "@classes/util/store/store";

const API_ROOT: string = "businesses";

export class BusinessServices {
    public static async create(business: Business, email: string) {
        return await DatabaseServices.create(Business, API_ROOT, { business, email });
    }

    public static async update(business: Business, email: string) {
        return await DatabaseServices.update(Business, API_ROOT, { business, email });
    }

    public static async delete(business: Business) {
        return await DatabaseServices.delete(`${API_ROOT}/${business.id}`);
    }

    public static async get(id: number) {
        return await DatabaseServices.get<Business>(
            Business,
            `${API_ROOT}/${id}`,
        );
    }

    public static async getAllForUser(id: number) {
        return await DatabaseServices.getAll<Business>(
            Business,
            `${API_ROOT}/user/${id}`,
        );
    }

    public static async swapCurrentBusiness(businessID: number) {
        const newBusiness = await DatabaseServices.get<Business>(
            Business,
            `/businesses/${businessID}`,
        );

        Store.businessStore.set(newBusiness);
    }
}
