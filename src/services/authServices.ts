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
            localStorage.setItem("user", JSON.stringify(user));

            const business = await apiClient.get(`/employees/${user.id}`); //This gets the business ID, but we def need to check if they actually belong to the business
            const businessID = business.data.businessID;

            router.push(`${businessID}/dashboard`);
        } else {
            console.error("Login failed: invalid credentials");
        }
    }
}
