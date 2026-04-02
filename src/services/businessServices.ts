import { Business } from "@classes/database/business";
import { DatabaseServices } from "@classes/util/databaseServices";
import { ParseLocalStorage } from "@classes/util/parseLocalStorage";

const API_ROOT: string = "businesses";

export class BusinessServices {
    static async create(business: Business) {
        await DatabaseServices.create(Business, API_ROOT, business);
    }

    static async update(business: Business) {
        await DatabaseServices.update(Business, API_ROOT, business);
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
            `${API_ROOT}/user/${id}`,
        );
    }

    static async swapBusinesses(businessID: number) {
        const newBusiness = await DatabaseServices.get<Business>(
            Business,
            `/businesses/${businessID}`,
        );

        const business = {
            id: newBusiness.id,
            name: newBusiness.name,
        };

        localStorage.setItem("business", JSON.stringify(business));
    }
}
