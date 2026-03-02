// export const enum Routes {
//     Dashboard = "/dashboard",
//     Schedule = "/schedule",
//     OpenShifts = "/openShifts",
//     Employees = "/employees",
//     Settings = "/settings",
// }

import { defineComponent, DefineComponent } from "vue";
import DashboardPage from "../pages/DashboardPage.vue";
import SchedulePage from "../pages/SchedulePage.vue";
import OpenShifts from "../components/dashboardCards/OpenShifts.vue";
import EmployeesPage from "../pages/EmployeesPage.vue";
import SettingsPage from "../pages/SettingsPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import { RouteRecordRaw } from "vue-router";
import NavbarLayout from "@components/NavbarLayout.vue";

//rag might want to get rid of component: any in favor of an actual type
class Route {
    constructor(
        public path: string,
        public component: any,
        public name: string,
        public requiresAuth: boolean = true,
        public navbarChildren?: Route[],
    ) {}

    //Provides a RouteRecordRaw for router routes
    unwrap(): RouteRecordRaw {
        return {
            path: this.path,
            component: this.component,
            name: this.name,
            meta: { requiresAuth: this.requiresAuth },
        };
    }
}

const navbarChildren = [
    new Route("/dashboard", DashboardPage, "Dashboard"),
    new Route("/schedule", SchedulePage, "Schedule"),
    new Route("/openShifts", OpenShifts, "Open Shifts"),
    new Route("/employees", EmployeesPage, "Employees"),
    new Route("/settings", SettingsPage, "Settings"),
];
export const routes = {
    Login: new Route("/login", LoginPage, "Login", false),
    NavbarLayout: new Route("/", NavbarLayout, "AppLayout", true, navbarChildren),
};
