import { router } from "../routing/router";
import { User } from "@classes/database/user";
import { apiClient } from "./services.ts";
import { Store } from "@classes/util/store.ts";
import { BusinessServices } from "./businessServices.ts";

const API_ROOT: string = "authentication/";

export class AuthServices {
    public static async login(token: string, code?: string) {
        let user: User;
        const result = await apiClient.post(API_ROOT, {
            credential: token,
            code: code,
        });

        if (result.data.valid) {
            user = result.data.user;
            user.token = result.data.token;

            Store.setUser(user);

            const businesses = await BusinessServices.getAllForUser(user.id);
            Store.setBusiness(businesses[0]);

            router.push(`nav/dashboard`);
        } else {
            console.error("Login failed: invalid credentials");
        }
    }

    public static async logout() {
        try {
            Store.clearUser();
            router.push("/login");

            await apiClient.post("/authentication/logout");
        } catch (error) {
            console.error("Logout failed", error);
            Store.clearUser();
            router.push("/login");
        }
    }

    public static async handleCredentialResponse(response: any) {
        const route = router.currentRoute.value;
        const inviteCode = route.params.code as string | undefined;

        const idToken = response.credential;
        await AuthServices.login(idToken, inviteCode);
    }
}
