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
import NoBusinessPage from "../pages/NoBusinessPage.vue";

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
        children?: Route[],
        redirect?: string,
    ): Route {
        return new Route(path, component, name, redirect, true, children);
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

    noAuth(): Route {
        this.requiresAuth = false;

        return this;
    }
}

export const routes = {
    Default: Route.create(
        "/",
        undefined,
        "Default",
        undefined,
        "/login",
    ).noAuth(),
    Login: Route.create("/login/:code?", LoginPage, "Login").noAuth(),
    NoBusiness: Route.create("/noBusiness", NoBusinessPage, "No Business"),
    NavbarLayout: Route.create(
        "/nav",
        NavbarLayout,
        "NavbarLayout",
        [
            Route.create("dashboard", DashboardPage, "Dashboard"),
            Route.create("schedule", SchedulePage, "Schedule"),
            Route.create("openShifts", OpenShiftsPage, "Open Shifts"),
            Route.create("employees", EmployeesPage, "Employees"),
            Route.create("settings", SettingsPage, "Settings"),
        ],
        "/nav/dashboard",
    ),
    MobileLayout: Route.create(
        "/mobile",
        NavbarLayout,
        "MobileNavbarLayout",
        [
            Route.create("homePage", HomePage, "Home Page").noAuth(),
            Route.create(
                "scheduleMobile",
                SchedulePageMobile,
                "Calendar",
            ).noAuth(),
            Route.create("tradeBoard", TradeBoardPage, "Trade Board").noAuth(),
        ],
        "/mobile/homePage",
    ),
    Admin: Route.create("/admin", AdminPage, "Admin"),
};
