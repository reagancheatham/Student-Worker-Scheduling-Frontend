<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
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

<template>
    <UDashboardSidebar resizable collapsible>
        <template #header="{ collapsed }">
            <AvatarMenu />
        </template>

        <template #default="{ collapsed }">
            <UDashboardSearchButton
                :collaped="collapsed"
                class="bg-transparent ring-default"
            />

            <UNavigationMenu orientation="vertical" :items="items" />
        </template>
    </UDashboardSidebar>

    <UDashboardSearch :groups="searchGroups" />
</template>
