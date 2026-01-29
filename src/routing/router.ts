import { createRouter, createWebHistory } from "vue-router";
import { Routes } from './routes.ts';

import DashboardPage from "../pages/DashboardPage.vue"
import OpenShiftsPage from "../pages/OpenShiftsPage.vue"
import SchedulePage from "../pages/SchedulePage.vue"
import SettingsPage from "../pages/SettingsPage.vue"

const routes = [
    { path: Routes.Dashboard, component: DashboardPage },
    { path: Routes.Schedule, component: SchedulePage},
    { path: Routes.OpenShifts, component: OpenShiftsPage},
    { path: Routes.Settings, component: SettingsPage},
]

export const router = createRouter({
    history: createWebHistory(),
    routes: routes,
});
