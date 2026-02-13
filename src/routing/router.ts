import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes.ts";

//creates dictionary for routes, so the list of routes can be looped through and unwrapped.
const unwrappedRoutes = Object.entries(routes).map((r) => r[1].unwrap());

export const router = createRouter({
    history: createWebHistory(),
    routes: unwrappedRoutes,
});
