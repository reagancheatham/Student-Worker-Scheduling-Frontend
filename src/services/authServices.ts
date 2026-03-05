import { router } from "../routing/router";
import { User } from "@classes/database/user";
import { apiClient } from "./services.ts";

const API_ROOT: string = "authentication/";

export class AuthServices {
    static async login(token: string) {
        let user: User;

        const result = await apiClient.post(API_ROOT, { credential: token });

        if (result.data.valid) {
            user = result.data.user;
            user.token = result.data.token;
        }

        if (user) {
            localStorage.setItem("user", JSON.stringify(user));

            router.push("/dashboard");
        } else {
            console.error("Login failed: invalid credentials");
        }
    }
}
