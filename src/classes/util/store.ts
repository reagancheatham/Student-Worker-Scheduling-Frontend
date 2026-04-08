import { Business } from "@classes/database/business.ts";
import { User } from "@classes/database/user.ts";

export class Store {
    public static getUser(): User {
        const storedUser = localStorage.getItem("user");
        let token: string | null = null;

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
            } catch (err) {
                console.error("Error parsing user from localStorage:", err);
                return null;
            }
        }

        return null;
    }

    public static setUser(user: User): void {
        localStorage.setItem("user", JSON.stringify(user));
    }

    public static getBusiness(): Business {
        const storedBusiness = localStorage.getItem("user");
        let token: string | null = null;

        if (storedBusiness) {
            try {
                const business = JSON.parse(storedBusiness);
                return new Business(business.id, business.name);
            } catch (err) {
                console.error("Error parsing business from localStorage:", err);
                return null;
            }
        }

        return null;
    }

    public static setBusiness(business: Business): void {
        localStorage.setItem("business", JSON.stringify(business));
    }
}
