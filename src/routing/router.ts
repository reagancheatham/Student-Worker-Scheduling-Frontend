import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes.ts";
import { Store } from "@classes/util/store.ts";

const unwrappedRoutes = Object.entries(routes).map((r) => r[1].unwrap());

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: unwrappedRoutes,
});

router.beforeEach((to, from, next) => {
    const user = Store.getUser();
    const token = user?.token;

    const inviteCode = !!to.params.code;

    if (to.meta.requiresAuth && !token) next("/login");
    else if (to.path.startsWith("/login") && token && !inviteCode)
        next("/nav/dashboard");
    else next();
});
