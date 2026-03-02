import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes.ts";

//creates dictionary for routes, so the list of routes can be looped through and unwrapped.
const unwrappedRoutes = Object.entries(routes).map((r) => r[1].unwrap());

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: unwrappedRoutes,
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next("/login");
    } else if (to.path === "/login" && isAuthenticated) {
        next("/dashboard"); // redirect logged-in users away from login
    } else {
        next(); // allow navigation
    }
});
