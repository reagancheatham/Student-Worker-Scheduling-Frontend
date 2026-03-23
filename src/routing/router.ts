import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes.ts";

const unwrappedRoutes = Object.entries(routes).map((r) => r[1].unwrap());

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: unwrappedRoutes,
});

router.beforeEach((to, from, next) => {
    const storedUser = localStorage.getItem("user");
    let token: string | null = null;

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

    if (to.meta.requiresAuth && !token) {
        next("/login");
    } else if (to.path === "/login" && token) {
        next("/nav/dashboard");
    } else {
        next();
    }
});
