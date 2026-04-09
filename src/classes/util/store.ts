import { Business } from "@classes/database/business.ts";
import { User } from "@classes/database/user.ts";

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

    public static getBusiness(): Business | undefined {
        const storedBusiness = localStorage.getItem("user");

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
        }

        return undefined;
    }

    public static setBusiness(business: Business): void {
        localStorage.setItem("business", JSON.stringify(business));
    }
}
