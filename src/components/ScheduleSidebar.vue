<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Routes } from "../routing/routes.ts";
import AvatarMenu from "./AvatarMenu.vue";

const route = useRoute();

const items = computed(() => [
    {
        label: "Dashboard",
        to: Routes.Dashboard,
        active: route.path.startsWith(Routes.Dashboard),
    },
    {
        label: "Schedule",
        to: Routes.Schedule,
        active: route.path.startsWith(Routes.Schedule),
    },
    {
        label: "Open Shifts",
        to: Routes.OpenShifts,
        active: route.path.startsWith(Routes.OpenShifts),
    },
    {
        label: "Settings",
        to: Routes.Settings,
        active: route.path.startsWith(Routes.Settings),
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
                    <span
                        :class="[
                            active
                                ? 'text-maroon-500'
                                : 'text-neutral-100',
                        ]"
                    >
                        {{ item.label }}
                    </span>
                </template>
            </UNavigationMenu>
        </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="searchGroups" />
</template>
