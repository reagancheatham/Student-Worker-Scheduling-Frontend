import DashboardPage from "../pages/DashboardPage.vue";
import SchedulePage from "../pages/SchedulePage.vue";
import EmployeesPage from "../pages/EmployeesPage.vue";
import SettingsPage from "../pages/SettingsPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import { RouteRecordRaw } from "vue-router";
import NavbarLayout from "@components/templates/NavbarLayout.vue";
import OpenShiftsPage from "../pages/OpenShiftsPage.vue";
import AdminPage from "../pages/AdminPage.vue";
import HomePage from "../mobile/pages/HomePage.vue";
import SchedulePageMobile from "../mobile/pages/SchedulePageMobile.vue";
import TradeBoardPage from "../mobile/pages/TradeBoardPage.vue";

class Route {
    constructor(
        public path: string,
        public component?: any,
        public name?: string,
        public redirect?: string,
        public requiresAuth: boolean = true,
        public children?: Route[],
    ) {}

    static create(
        path: string,
        component: any,
        name: string,
        requiresAuth: boolean = true,
        children?: Route[],
    ) {
        return new Route(path, component, name, null, requiresAuth, children);
    }

    static createRedirect(path: string, name: string, redirect: string): Route {
        return new Route(path, null, name, redirect);
    }

    unwrap(): RouteRecordRaw {
        return {
            path: this.path,
            component: this.component,
            name: this.name,
            meta: { requiresAuth: this.requiresAuth },
            children: this.children ? this.children.map((c) => c.unwrap()) : [],
            redirect: this.redirect,
        };
    }
}

export const routes = {
    Default: Route.createRedirect("/", "Default", "/login"),
    Login: Route.create("/login/:code?", LoginPage, "Login", false),
    NavbarLayout: Route.create("/nav", NavbarLayout, "NavbarLayout", true, [
        Route.create("dashboard", DashboardPage, "Dashboard", true),
        Route.create("schedule", SchedulePage, "Schedule", true),
        Route.create("openShifts", OpenShiftsPage, "Open Shifts", true),
        Route.create("employees", EmployeesPage, "Employees", true),
        Route.create("settings", SettingsPage, "Settings", true),
    ]),
    MobileLayout: Route.create("/mobile", NavbarLayout, "MobileLayout", false, [
        Route.create("homePage", HomePage, "Home Page", false),
        Route.create("scheduleMobile", SchedulePageMobile, "Calendar", false),
        Route.create("tradeBoard", TradeBoardPage, "Trade Board", false),
    ]),
    Admin: new Route("/admin", AdminPage, "Admin", "", true)
};
