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
import ScheduleContainerPage from "../pages/ScheduleContainerPage.vue";
import ScheduleTemplatePage from "../pages/ScheduleTemplatePage.vue";

class Route {
    constructor(
        public path: string,
        public component: any,
        public name: string,
        public children: Route[],
        public redirect?: string,
        public requiresAuth: boolean = true,
    ) {}

    static create(
        path: string,
        component: any,
        name: string,
        children: Route[] = [],
        redirect?: string,
    ): Route {
        return new Route(path, component, name, children, redirect, true);
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

const navbarLayout = Route.create(
    "/nav",
    NavbarLayout,
    "NavbarLayout",
    [
        Route.create("dashboard", DashboardPage, "Dashboard").noAuth(),
        Route.create(
            "scheduleContainer",
            ScheduleContainerPage,
            "Schedule Container",
            [
                Route.create("schedule", SchedulePage, "Schedule Editor"),
                Route.create(
                    "scheduleTemplate",
                    ScheduleTemplatePage,
                    "Schedule Template Editor",
                ),
            ],
            "/nav/scheduleContainer/schedule",
        ).noAuth(),
        Route.create("openShifts", OpenShiftsPage, "Open Shifts").noAuth(),
        Route.create("employees", EmployeesPage, "Employees").noAuth(),
        Route.create("settings", SettingsPage, "Settings").noAuth(),
    ],
    "/nav/dashboard",
);

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
    NavbarLayout: navbarLayout,
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

export const subRoutes = {
    Dashboard: navbarLayout.children[0],
    ScheduleContainer: navbarLayout.children[1],
    Schedule: navbarLayout.children[1].children[0],
    ScheduleTemplate: navbarLayout.children[1].children[1],
    OpenShifts: navbarLayout.children[2],
    Employees: navbarLayout.children[3],
    Settings: navbarLayout.children[4],
};
