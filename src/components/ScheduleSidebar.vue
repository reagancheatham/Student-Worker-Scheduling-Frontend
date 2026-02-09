<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { routes } from "../routing/routes.ts";
import AvatarMenu from "./AvatarMenu.vue";

const route = useRoute();

const items = computed(() => [
    {
        label: "Dashboard",
        icon: "i-lucide-house",
        to: routes.Dashboard.path,
        active: route.path.startsWith(routes.Dashboard.path),
    },
    {
        label: "Schedule",
        icon: "i-lucide-calendar-fold",
        to: routes.Schedule.path,
        active: route.path.startsWith(routes.Schedule.path),
    },
    {
        label: "Open Shifts",
        icon: "i-lucide-briefcase",
        to: routes.OpenShifts.path,
        active: route.path.startsWith(routes.OpenShifts.path),
    },
    {
        label: "Employees",
        icon: "i-lucide-users",
        to: routes.Employees.path,
        active: route.path.startsWith(routes.Employees.path),
    },
    {
        label: "Settings",
        icon: "i-lucide-settings",
        to: routes.Settings.path,
        active: route.path.startsWith(routes.Settings.path),
    },
]);

const searchGroups = computed(() => [
    {
        id: "links",
        label: "Go to",
        items: items.value.flat(),
    },
]);
</script>

<style>
.sidebar {
    background-color: var(--color-maroon-500);
}
</style>

<template>
    <UDashboardSidebar class="sidebar" resizable collapsible>
        <template #header="{ collapsed }">
            <AvatarMenu />
        </template>

        <template #default="{ collapsed }">
            <UDashboardSearchButton
                :collaped="collapsed"
                class="bg-transparent ring-default text-neutral-200 hover:text-black"
            />

            <UNavigationMenu orientation="vertical" :items="items">
                <template #item="{ item, active }">
                    <div class="flex items-center gap-3">
                        <UIcon 
                            v-if="item.icon"
                            :name="item.icon"
                            :class="[
                                'w-5 h-5',
                                active ? 'text-maroon-500' : 'text-neutral-100'
                            ]" 
                        />

                            <span
                                :class="[
                                    active
                                        ? 'text-maroon-500'
                                        : 'text-neutral-100',
                                ]"
                            >
                                {{ item.label }}
                            </span>
                    </div>
                </template>
            </UNavigationMenu>
        </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="searchGroups" />
</template>
