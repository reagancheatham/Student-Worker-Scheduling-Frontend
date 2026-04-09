<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { routes } from "../routing/routes.ts";
import AvatarMenu from "./AvatarMenu.vue";
import { AuthServices } from "../services/authServices.ts";

const route = useRoute();
const settingsPath = routes.NavbarLayout.children![4].path;
const searchTerm = ref("");

const links = computed(() => [
    {
        label: "Dashboard",
        icon: "i-lucide-house",
        to: routes.NavbarLayout.children![0].path,
        active: route.path.includes(routes.NavbarLayout.children![0].path),
    },
    {
        label: "Schedule",
        icon: "i-lucide-calendar-fold",
        to: routes.NavbarLayout.children![1].path,
        active: route.path.includes(routes.NavbarLayout.children![1].path),
    },
    {
        label: "Open Shifts",
        icon: "i-lucide-briefcase",
        to: routes.NavbarLayout.children![2].path,
        active: route.path.includes(routes.NavbarLayout.children![2].path),
    },
    {
        label: "Employees",
        icon: "i-lucide-users",
        to: routes.NavbarLayout.children![3].path,
        active: route.path.includes(routes.NavbarLayout.children![3].path),
    },
    {
        label: "Settings",
        icon: "i-lucide-settings",
        to: routes.NavbarLayout.children![4].path,
        active: route.path.includes(routes.NavbarLayout.children![4].path),
    },
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
        items: links.value.flat(),
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

            <UNavigationMenu orientation="vertical" :items="links">
                <template #item="{ item, active }">
                    <div
                        :class="[
                            'flex items-center gap-3 w-full',
                            collapsed ? 'justify-center' : 'justify-start',
                        ]"
                    >
                        <UIcon
                            v-if="item.icon"
                            :name="item.icon"
                            :class="[
                                'w-5 h-5 shrink-0',
                                active ? 'text-maroon-500' : 'text-neutral-100',
                            ]"
                        />

                        <span
                            v-if="!collapsed"
                            :class="[
                                active ? 'text-maroon-500' : 'text-neutral-100',
                            ]"
                        >
                            {{ item.label }}
                        </span>
                    </div>
                </template>
            </UNavigationMenu>
        </template>
    </UDashboardSidebar>

    <UDashboardSearch v-model:search-term="searchTerm" :groups="searchGroups" />
</template>
