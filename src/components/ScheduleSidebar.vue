<script setup lang="ts">
import { computed } from "vue";
import { subRoutes } from "../routing/routes.ts";
import AvatarMenu from "./AvatarMenu.vue";
import { AuthServices } from "../services/authServices.ts";
import { useRoute } from "vue-router";

const route = useRoute();
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
        label: "Open Shifts",
        icon: "i-lucide-briefcase",
        to: subRoutes.OpenShifts,
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
]);

const actions = computed(() => [
    {
        label: "Log Out",
        icon: "i-lucide-log-out",
        onSelect: () => AuthServices.logout(),
    },
]);

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
                <!-- <template #item="{ item, active }">
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
                </template> -->
            </UNavigationMenu>
        </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="searchGroups" :color-mode="false" />
</template>
