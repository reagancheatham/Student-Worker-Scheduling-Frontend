import { router } from "../routing/router";
import { User } from "@classes/database/user";
import { apiClient } from "./services.ts";
import { Store } from "@classes/util/store.ts";

const API_ROOT: string = "authentication/";

export class AuthServices {
    static async login(token: string) {
        let user: User;
        const result = await apiClient.post(API_ROOT, { credential: token });

        if (result.data.valid) {
            user = result.data.user;
            user.token = result.data.token;

            Store.setUser(user);

            const business = await apiClient.get(`/employees/${user.id}`); //This gets the business ID, but we def need to check if they actually belong to the business

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
