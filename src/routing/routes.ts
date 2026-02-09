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
import { RouteRecordRaw } from "vue-router";

//rag might want to get rid of component: any in favor of an actual type
class Route {
    constructor(
        public path: string,
        public component: any,
        public name: string,
    ) {}

    //Provides a RouteRecordRaw for router routes
    unwrap(): RouteRecordRaw {
        return { path: this.path, component: this.component, name: this.name };
    }
}

export const routes = {
    Dashboard: new Route("/dashboard", DashboardPage, "Dashboard"),
    Schedule: new Route("/schedule", SchedulePage, "Schedule"),
    OpenShifts: new Route("/openShifts", OpenShifts, "Open Shifts"),
    Employees: new Route("/employees", EmployeesPage, "Employees"),
    Settings: new Route("/settings", SettingsPage, "Settings"),
};
