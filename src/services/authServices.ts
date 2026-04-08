import { router } from "../routing/router";
import { User } from "@classes/database/user";
import { apiClient } from "./services.ts";

const API_ROOT: string = "authentication/";

export class AuthServices {
    static async login(token: string, code?: string) {
        let user: User;
        const result = await apiClient.post(API_ROOT, { credential: token, code: code });

        if (result.data.valid) {
            user = result.data.user;
            user.token = result.data.token;
            localStorage.setItem("user", JSON.stringify(user));

            const business = await apiClient.get(`/employees/${user.id}`); //This gets the business ID, but we def need to check if they actually belong to the business
            const businessID = business.data.businessID;

            router.push(`nav/dashboard`);
        } else {
            console.error("Login failed: invalid credentials");
        }
    }

    static async logout() {
        try {
            const user = JSON.parse(localStorage.getItem("user")!);

            localStorage.removeItem("user");
            router.push("/login");

            await apiClient.post(
                "/authentication/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                },
            );

            
        } catch (error) {
            console.error("Logout failed", error);
            localStorage.removeItem("user");
            router.push("/login");
        }
    }
}
