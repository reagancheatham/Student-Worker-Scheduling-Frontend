import DashboardPage from "../pages/DashboardPage.vue";
import SchedulePage from "../pages/schedule/SchedulePage.vue";
import EmployeesPage from "../pages/employees/EmployeesPage.vue";
import SettingsPage from "../pages/SettingsPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import { RouteRecordRaw } from "vue-router";
import NavbarLayout from "@components/templates/NavbarLayout.vue";
import NotificationsPage from "../pages/NotificationsPage.vue";
import AdminPage from "../pages/admin/AdminPage.vue";
import HomePage from "../mobile/pages/HomePage.vue";
import SchedulePageMobile from "../mobile/pages/SchedulePageMobile.vue";
import TradeBoardPage from "../mobile/pages/TradeBoardPage.vue";
import NoBusinessPage from "../pages/NoBusinessPage.vue";
import ScheduleTemplatePage from "../pages/schedule/ScheduleTemplatePage.vue";
import RolesPage from "../pages/employees/RolesPage.vue";
import TaskListsPage from "../pages/schedule/TaskListsPage.vue";

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
        Route.create("dashboard", DashboardPage, "Dashboard"),
        Route.create("schedule", SchedulePage, "Schedule Editor"),
        Route.create(
            "scheduleTemplate",
            ScheduleTemplatePage,
            "Schedule Template Editor",
        ),
        Route.create("taskLists", TaskListsPage, "Task Lists"),
        Route.create(
            "notifications",
            NotificationsPage,
            "Notifications",
        ),
        Route.create("employeeList", EmployeesPage, "Employee List"),
        Route.create("roles", RolesPage, "Roles"),
        Route.create("settings", SettingsPage, "Settings"),
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
    Login: Route.create("/login", LoginPage, "Login").noAuth(),
    InviteLogin: Route.create(
        "/login/:code?",
        LoginPage,
        "Invite Login",
    ).noAuth(),
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
    Schedule: navbarLayout.children[1],
    ScheduleTemplate: navbarLayout.children[2],
    TaskLists: navbarLayout.children[3],
    Notifications: navbarLayout.children[4],
    EmployeeList: navbarLayout.children[5],
    Roles: navbarLayout.children[6],
    Settings: navbarLayout.children[7],
};
