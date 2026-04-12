import { Business } from "@classes/database/business.ts";
import { User } from "@classes/database/user.ts";
import { BusinessServices } from "../../services/businessServices.ts";

export class Store {
    public static getUser(): User | undefined {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                return new User(
                    user.id,
                    user.studentID,
                    user.permissionRoleID,
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.phoneNumber,
                    user.token,
                    user.profilePicture,
                );
            } catch (error) {
                console.error(`Error parsing user from localStorage: ${error}`);
                return undefined;
            }
        }

        return undefined;
    }

    public static setUser(user: User): void {
        localStorage.setItem("user", JSON.stringify(user));
    }

    public static clearUser(): void {
        localStorage.removeItem("user");
    }

    public static async getBusiness(): Promise<Business | undefined> {
        const storedBusiness = localStorage.getItem("business");

        if (storedBusiness) {
            try {
                const business = JSON.parse(storedBusiness);
                return new Business(business.id, business.name);
            } catch (error) {
                console.error(
                    `Error parsing business from localStorage: ${error}`,
                );
                return undefined;
            }
        } else {
            try {
                const user = Store.getUser();

                if (!user) return undefined;

                const businesses = await BusinessServices.getAllForUser(
                    user.id,
                );

                if (!businesses || businesses.length === 0) return undefined;

                Store.setBusiness(businesses[0]);
                return businesses[0];
            } catch (error) {
                console.error(`Error retrieving business for user`);

                return undefined;
            }
        }
    }

    public static setBusiness(business: Business): void {
        localStorage.setItem("business", JSON.stringify(business));
    }

    public static clearBusiness(): void {
        localStorage.removeItem("business");
    }

    public static clear(): void {
        Store.clearUser();
        Store.clearBusiness();
    }
}
