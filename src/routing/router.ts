import { createRouter, createWebHashHistory } from "vue-router";
import { routes } from "./routes.ts";
import { AuthServices } from "../services/authServices.ts";
import { Store } from "@classes/util/store/store.ts";

const unwrappedRoutes = Object.entries(routes).map((r) => r[1].unwrap());

export const router = createRouter({
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes: unwrappedRoutes,
});

router.beforeEach(async (to, from, next) => {
    const inviteCode = !!to.params.code;

    if (to.meta.requiresAuth) {
        const valid = await AuthServices.validateSession();

        if (valid) next();
        else next(routes.Login.path);
    } else if (to.path.startsWith(routes.Login.path)) {
        if (inviteCode) {
            next();
            return;
        }

        const user = Store.userStore.getImmediate();

        if (!user) {
            next();
            return;
        }

        const valid = await AuthServices.validateSession();

        if (valid) {
            if (user.permissionRoleID > 1) next(routes.NavbarLayout.path);
            else next(routes.UserDesktopLayout.path);
        } else {
            Store.clear();
            next();
        }
    } else next();
});
