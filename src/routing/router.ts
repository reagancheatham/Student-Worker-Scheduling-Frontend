import { createRouter, createWebHistory } from "vue-router";
import { Routes } from './routes.ts';

import DashboardPage from "../pages/DashboardPage.vue"
import OpenShiftsPage from "../pages/OpenShiftsPage.vue"
import EmployeesPage from "../pages/EmployeesPage.vue";
import SchedulePage from "../pages/SchedulePage.vue"
import SettingsPage from "../pages/SettingsPage.vue"

const routes = [
    { path: '/', component: DashboardPage, name: 'Dashboard' },
    { path: Routes.Dashboard, component: DashboardPage, name: 'Dashboard' },
    { path: Routes.Schedule, component: SchedulePage, name: 'Schedule' },
    { path: Routes.OpenShifts, component: OpenShiftsPage, name: 'Open Shifts' },
    { path: Routes.Employees, component: EmployeesPage, name: 'Employees'},
    { path: Routes.Settings, component: SettingsPage, name: 'Settings' },
]

export const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});
