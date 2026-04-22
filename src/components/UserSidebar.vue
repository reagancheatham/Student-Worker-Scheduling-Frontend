<script setup lang="ts">
import { computed } from "vue";
import AvatarMenu from "./AvatarMenu.vue";
import { AuthServices } from "../services/authServices.ts";
import { userSubRoutes } from "../routing/routes.ts";

const links = computed(() => [
    {
        label: "Clock In",
        icon: "i-lucide-clock",
        to: userSubRoutes.ClockIn,
    },
    {
        label: "Calendar",
        icon: "i-lucide-calendar",
        to: userSubRoutes.Calendar,
    },
    {
        label: "Shift Board",
        icon: "i-lucide-kanban",
        to: userSubRoutes.ShiftBoard,
    },
    {
        label: "Time Sheets",
        icon: "i-lucide-clipboard-list",
        to: userSubRoutes.TimeSheets,
    },
    {
        label: "Time Off",
        icon: "i-lucide-plane",
        to: userSubRoutes.TimeOff,
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
        items: links.value,
    },
    {
        id: "actions",
        label: "Actions",
        items: actions.value,
    },
]);
</script>

<style>
.user-sidebar {
    background-color: var(--color-maroon-500);
}
</style>

<template>
    <UDashboardSidebar
        class="user-sidebar"
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
                }"
            />
        </template>
    </UDashboardSidebar>
    <UDashboardSearch :groups="searchGroups" :color-mode="false" />
</template>