import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes.ts";
import { Store } from "@classes/util/store.ts";
import { AuthServices } from "../services/authServices.ts";

const unwrappedRoutes = Object.entries(routes).map((r) => r[1].unwrap());

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: unwrappedRoutes,
});

router.beforeEach((to, from, next) => {
    const storedUser = localStorage.getItem("user");
    let token: string | null = null;
    let businessID = 1;

    if (storedUser) {
        try {
            const parsedUser = JSON.parse(storedUser);
            token = parsedUser.token;
        } catch (err) {
            console.error(
                "Error parsing user from localStorage: " + JSON.stringify(err),
            );
            token = null;
        }
    }
    const inviteCode = !!to.params.code;

    if (to.meta.requiresAuth) {
        const valid = await AuthServices.validateSession();

        if (valid) next();
        else next(routes.Login.path);
    } else if (to.path == routes.Login.path) {
        if (inviteCode) {
            next();
            return;
        }

        const valid = await AuthServices.validateSession();

        if (valid) next(routes.NavbarLayout.children[0]);
        else next();
    } else next();
});
