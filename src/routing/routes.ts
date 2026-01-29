import DashboardPage from "../pages/DashboardPage.vue"
import OpenShiftsPage from "../pages/OpenShiftsPage.vue"
import SchedulePage from "../pages/SchedulePage.vue"
import SettingsPage from "../pages/SettingsPage.vue"

export const Routes = [
    { path: '/dashboard', component: DashboardPage },
    { path: '/schedule', component: SchedulePage},
    { path: '/openShifts', component: OpenShiftsPage},
    { path: '/settings', component: SettingsPage}
]

