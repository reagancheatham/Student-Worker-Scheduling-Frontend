import { Business } from "@classes/database/business.ts";
import { StoreField } from "./storeField.ts";
import { Store } from "./store.ts";
import { BusinessServices } from "../../../services/businessServices.ts";

const STORE_KEY = "business";

export class BusinessStoreField extends StoreField<Business> {
    public async get(): Promise<Business | undefined> {
        const storedBusiness = localStorage.getItem(STORE_KEY);

        if (storedBusiness && storedBusiness != "undefined") {
            try {
                return Business.createFromData(JSON.parse(storedBusiness));
            } catch (error: any) {
                console.error(`Error retrieving business: ${error}`);
                return undefined;
            }
        } else {
            try {
                const user = await Store.userStore.get();

                if (!user) return undefined;

                const businesses = await BusinessServices.getAllForUser(
                    user.id,
                );

                if (!businesses || businesses.length === 0) return undefined;

                Store.businessStore.set(businesses[0]);
                return businesses[0];
            } catch (error: any) {
                console.error(`Error retrieving business for user: ${error}`);

                return undefined;
            }
        }
    }

    public set(value: Business): void {
        localStorage.setItem(STORE_KEY, JSON.stringify(value));
        Store.employeeStore.clear();
    }

    public clear(): void {
        localStorage.removeItem(STORE_KEY);
    }
}
