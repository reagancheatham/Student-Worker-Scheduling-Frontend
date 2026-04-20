import { router } from "../routing/router";
import { User } from "@classes/database/user";
import { apiClient } from "./services.ts";
import { Store } from "@classes/util/store/store.ts";
import { BusinessServices } from "./businessServices.ts";
import { Admin } from "@classes/util/permissionRole.ts";
import { routes } from "../routing/routes.ts";

const API_ROOT: string = "authentication";

export class AuthServices {
    public static async login(token: string, code?: string) {
        let user: User;
        try {
            const result = await apiClient.post(API_ROOT, {
                credential: token,
                code: code,
            });

            if (result.data.valid) {
                user = result.data.user;
                user.token = result.data.token;

                Store.userStore.set(user);

                if (user.permissionRoleID == Admin.id) {
                    router.push(routes.Admin.path);
                    return;
                } else {
                    const businesses = await BusinessServices.getAllForUser(
                        user.id,
                    );

                    if (businesses && businesses.length > 0) {
                        const firstBusiness = businesses[0];
                        Store.businessStore.set(firstBusiness);

                        router.push(routes.NavbarLayout.children![0].path);
                    } else {
                        Store.businessStore.clear();
                        router.push(routes.NoBusiness.path);
                    }
                }
            } else {
                console.error("Login failed: invalid credentials");
            }
        } catch (error) {
            console.error(`Error logging in: ${error}`);
        }
    }

    public static async logout() {
        try {
            Store.userStore.clear();
            router.push(routes.Login.path);

            await apiClient.post(`${API_ROOT}/logout`);
        } catch (error) {
            console.error("Logout failed: ", error);
            Store.userStore.clear();
            router.push(routes.Login.path);
        }
    }

    public static async validateSession(): Promise<boolean> {
        try {
            const user = Store.userStore.getImmediate();

            if (!user) return false;

            const result = await apiClient.post(`authentication/validate`);
            console.log("Validating")

            return result.data.valid;
        } catch (error) {
            console.error(`Error validating session: ${error}`);

            return false;
        }
    }

    public static async handleCredentialResponse(response: any) {
        const route = router.currentRoute.value;
        const inviteCode = route.params.code as string | undefined;

        const idToken = response.credential;
        await AuthServices.login(idToken, inviteCode);
    }
}
