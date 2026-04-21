<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { routes } from "../routing/routes.ts";
import AvatarMenu from "./AvatarMenu.vue";
import { AuthServices } from "../services/authServices.ts";
import { useRoute } from "vue-router";
import { PermissionRoleServices } from "../services/permissionRoleServices.ts";
import { Store } from "@classes/util/store/store.ts";

const isAdmin = ref(false);

onMounted(async () => {
    const permissionRoleID = Store.userStore.getImmediate()?.permissionRoleID
    if (!permissionRoleID) return;
    const role = await PermissionRoleServices.get(permissionRoleID);
    isAdmin.value = role.name === "Admin";
});

const route = useRoute();
const settingsPath = routes.NavbarLayout.children![4].path;
const searchTerm = ref("");

const links = computed(() => [
    {
        label: "Dashboard",
        icon: "i-lucide-house",
        to: subRoutes.Dashboard,
    },
    {
        label: "Schedule",
        icon: "i-lucide-calendar-fold",
        defaultOpen:
            route.path.includes(subRoutes.Schedule.path) ||
            route.path.includes(subRoutes.ScheduleTemplate.path),
        children: [
            {
                label: "Schedule Editor",
                icon: "i-lucide-calendar-clock",
                to: subRoutes.Schedule,
            },
            {
                label: "Template Editor",
                icon: "i-lucide-calendar-cog",
                to: subRoutes.ScheduleTemplate,
            },
        ],
    },
    {
        label: "Notifications",
        icon: "i-lucide-briefcase",
        to: subRoutes.Notifications,
    },
    {
        label: "Employees",
        icon: "i-lucide-users",
        defaultOpen:
            route.path.includes(subRoutes.EmployeeList.path) ||
            route.path.includes(subRoutes.Roles.path),
        children: [
            {
                label: "Employee List",
                icon: "i-lucide-list",
                to: subRoutes.EmployeeList,
            },
            {
                label: "Roles",
                icon: "i-lucide-clipboard-list",
                to: subRoutes.Roles,
            },
        ],
    },
    {
        label: "Settings",
        icon: "i-lucide-settings",
        to: subRoutes.Settings,
    },
    ...(isAdmin.value ? [{
        label: "Go To Admin",
        icon: "i-lucide-shield",
        to: routes.Admin,
    }] : []),
]);

const settingsSearchItems = [
    {
        label: "Dark Mode",
        icon: "i-lucide-moon-star",
        to: `${settingsPath}#darkMode`,
        keywords: "theme appearance browser",
    },
    {
        label: "Double Task Sign Off",
        icon: "i-lucide-check-check",
        to: `${settingsPath}#doubleTaskSignOff`,
        keywords: "task approval complete",
    },
    {
        label: "Employee Sign Off",
        icon: "i-lucide-signpost",
        to: `${settingsPath}#employeeSignOff`,
        keywords: "employee confirmation shift",
    },
    {
        label: "Allow Clock In/Out",
        icon: "i-lucide-clock-3",
        to: `${settingsPath}#allowClockInOut`,
        keywords: "time tracking clock",
    },
    {
        label: "Automatic Shift Trades",
        icon: "i-lucide-refresh-cw",
        to: `${settingsPath}#automaticShiftTrades`,
        keywords: "trade auto approve",
    },
    {
        label: "Enable Open Shift",
        icon: "i-lucide-briefcase",
        to: `${settingsPath}#enableOpenShift`,
        keywords: "open board publish",
    },
    {
        label: "Enable Shift Trades",
        icon: "i-lucide-repeat-2",
        to: `${settingsPath}#enableShiftTrades`,
        keywords: "trades requests",
    },
    {
        label: "Clock In Threshold",
        icon: "i-lucide-alarm-clock",
        to: `${settingsPath}#clockInThreshold`,
        keywords: "minutes early late",
    },
    {
        label: "On-Time Threshold",
        icon: "i-lucide-timer",
        to: `${settingsPath}#onTimeThreshold`,
        keywords: "grace period late",
    },
];

const filteredSettingsSearchItems = computed(() => {
    const query = searchTerm.value.trim().toLowerCase();

    if (!query) {
        return [];
    }

    const tokens = query.split(/\s+/).filter(Boolean);

    return settingsSearchItems.filter((item) => {
        const haystack = `${item.label} ${item.keywords}`.toLowerCase();
        return tokens.some((token) => haystack.includes(token));
    });
});

const searchGroups = computed(() => [
    {
        id: "links",
        label: "Go to",
        items: links.value.flatMap((link) =>
            link.children ? [link, ...link.children] : [link],
        ),
    },
    {
        id: "actions",
        label: "Actions",
        items: actions.value.flat(),
    },
    ...(filteredSettingsSearchItems.value.length
        ? [
              {
                  id: "settings",
                  label: "Settings",
                  items: filteredSettingsSearchItems.value,
              },
          ]
        : []),
]);
</script>

<style>
.sidebar {
    background-color: var(--color-maroon-500);
}
</style>

<template>
    <UDashboardSidebar
        class="sidebar"
        resizable
        collapsible
        :ui="{
            header: 'bg-maroon-500 border-0',
            body: 'bg-maroon-500',
            toggle: 'text-neutral-100 hover:text-primary',
        }"
        :default-size="15"
    >
        <template #header="{ collapsed }">
            <AvatarMenu :collapsed="collapsed" />
        </template>

        <template #default="{ collapsed }">
            <UDashboardSearchButton
                :collapsed="collapsed"
                class="bg-transparent ring-default text-neutral-200 hover:text-black"
                :kbds="[]"
            />

            <UNavigationMenu
                orientation="vertical"
                :items="links"
                :ui="{
                    item: 'gap-3 w-full',
                    link: [
                        'group px-2 py-2 rounded-md transition-colors',
                        collapsed ? 'justify-center' : 'justify-start',
                        'text-neutral-100 hover:text-white data-active:text-maroon-500',
                    ],
                    linkLeadingIcon: [
                        'w-5 h-5 shrink-0 transition-colors',
                        'text-neutral-100 group-hover:text-white data-active:text-maroon-500 group-data-active:text-maroon-500',
                    ],
                    linkTrailing: collapsed ? 'hidden' : 'block',
                    linkTrailingIcon: collapsed ? 'hidden' : 'block',
                    linkLabel: collapsed ? 'hidden' : 'block',
                    childList: 'ml-6 pl-2',
                }"
            >
            </UNavigationMenu>
        </template>
    </UDashboardSidebar>

    <UDashboardSearch v-model:search-term="searchTerm" :groups="searchGroups" />
</template>
