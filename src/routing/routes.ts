import DashboardPage from "../pages/DashboardPage.vue";
import SchedulePage from "../pages/SchedulePage.vue";
import EmployeesPage from "../pages/EmployeesPage.vue";
import SettingsPage from "../pages/SettingsPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import { RouteRecordRaw } from "vue-router";
import NavbarLayout from "@components/templates/NavbarLayout.vue";
import OpenShiftsPage from "../pages/OpenShiftsPage.vue";

class Route {
    constructor(
        public path: string,
        public component: any,
        public name: string,
        public requiresAuth: boolean = true,
        public children?: Route[],
    ) {}

    unwrap(): RouteRecordRaw {
        return {
            path: this.path,
            component: this.component,
            name: this.name,
            meta: { requiresAuth: this.requiresAuth },
            children: this.children ? this.children.map((c) => c.unwrap()) : [],
        };
    }
}

export const routes = {
    Login: new Route("/login", LoginPage, "Login", false),
    NavbarLayout: new Route(
        "/nav",
        NavbarLayout,
        "NavbarLayout",
        true,
        [
            new Route("dashboard", DashboardPage, "Dashboard", true),
            new Route("schedule", SchedulePage, "Schedule", true),
            new Route("openShifts", OpenShiftsPage, "Open Shifts", true),
            new Route("employees", EmployeesPage, "Employees", true),
            new Route("settings", SettingsPage, "Settings", true),
        ],
    ),
};
