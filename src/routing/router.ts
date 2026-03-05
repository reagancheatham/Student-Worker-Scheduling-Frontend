import { createRouter, createWebHistory } from "vue-router";
import { routes } from "./routes.ts";

//creates dictionary for routes, so the list of routes can be looped through and unwrapped.
const unwrappedRoutes = Object.entries(routes).map((r) => r[1].unwrap());

console.log(unwrappedRoutes);
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
      console.error("Error parsing user from localStorage:", err);
      token = null;
    }
  }

  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if (to.path === "/login" && token) {
    next("/dashboard"); 
  } else {
    next(); 
  }
});
