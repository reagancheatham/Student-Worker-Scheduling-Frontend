// export const enum Routes {
//     Dashboard = "/dashboard",
//     Schedule = "/schedule",
//     OpenShifts = "/openShifts",
//     Employees = "/employees",
//     Settings = "/settings",
// }

import DashboardPage from "../pages/DashboardPage.vue";
import SchedulePage from "../pages/SchedulePage.vue";
import EmployeesPage from "../pages/EmployeesPage.vue";
import SettingsPage from "../pages/SettingsPage.vue";
import LoginPage from "../pages/LoginPage.vue";
import { RouteRecordRaw } from "vue-router";
import NavbarLayout from "@components/templates/NavbarLayout.vue";
import OpenShiftsPage from "../pages/OpenShiftsPage.vue";

//rag might want to get rid of component: any in favor of an actual type
class Route {
  constructor(
    public path: string,
    public component: any,
    public name: string,
    public requiresAuth: boolean = true,
    public children?: Route[],
  ) {}

  //Provides a RouteRecordRaw for router routes
  unwrap(): RouteRecordRaw {
    return {
      path: this.path,
      component: this.component,
      name: this.name,
      meta: { requiresAuth: this.requiresAuth },
      children: this.children ? this.children.map((c) => c.unwrap()) : []
    };
  }
}

const navbarChildren = [];
export const routes = {
  Login: new Route("/login", LoginPage, "Login", false),
  NavbarLayout: new Route("", NavbarLayout, "NavbarLayout", true, [
    new Route("/dashboard", DashboardPage, "Dashboard", true),
    new Route("/schedule", SchedulePage, "Schedule", true),
    new Route("/openShifts", OpenShiftsPage, "Open Shifts", true),
    new Route("/employees", EmployeesPage, "Employees", true),
    new Route("/settings", SettingsPage, "Settings", true),
  ]),
};
