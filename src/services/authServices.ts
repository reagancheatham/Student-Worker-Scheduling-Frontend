import { router } from "../routing/router";
import { User } from "@classes/database/user";
import { apiClient } from "./services.ts";
import { Store } from "@classes/util/store.ts";

const API_ROOT: string = "authentication/";

export class AuthServices {
    static async login(token: string, code?: string) {
        let user: User;
        const result = await apiClient.post(API_ROOT, {
            credential: token,
            code: code,
        });

        if (result.data.valid) {
            user = result.data.user;
            user.token = result.data.token;

            Store.setUser(user);

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

            await apiClient.post("/authentication/logout");
        } catch (error) {
            console.error("Logout failed", error);
            localStorage.removeItem("user");
            router.push("/login");
        }
    }
}
