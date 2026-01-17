<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Routes } from "./routing/routes.ts";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
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
</script>

<template>
    <UApp>
        <UHeader title="" toggle-side="left">
            <UNavigationMenu orientation="vertical" :items="items" />
        </UHeader>
        <UMain>
            <NuxtLayout>
                <NuxtPage />
            </NuxtLayout>
        </UMain>
        <UFooter />
    </UApp>
</template>
