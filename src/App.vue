<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { Routes } from "./routing/routes.ts";
import { initializeFirebaseCloudMessaging } from "./firebase/messaging.ts";

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

const searchGroups = computed(() => [
    {
        id: "links",
        label: "Go to",
        items: items.value.flat(),
    },
]);

async function initializeMessaging() {
    await initializeFirebaseCloudMessaging();
}
</script>

<template>
    <UApp>
        <UMain>
            <UDashboardGroup>
                <UDashboardSidebar resizable collapsible>
                    <template #default="{ collapsed }">
                        <UDashboardSearchButton
                            :collaped="collapsed"
                            class="bg-transparent ring-default"
                        />

                        <UNavigationMenu
                            orientation="vertical"
                            :items="items"
                        />
                    </template>
                </UDashboardSidebar>
                <UDashboardPanel>
                    <template #header>
                        <UDashboardNavbar></UDashboardNavbar>
                    </template>
                </UDashboardPanel>

                <UDashboardSearch :groups="searchGroups" />
            </UDashboardGroup>
        </UMain>

        <UFooter />
        <UContainer
            style="
                position: relative;
                z-index: 10;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 200px;
                margin-top: 20px;
            "
        >
            <UButton type="button"  @click="initializeMessaging">
                Test Notifications
            </UButton>
            <p id="test">test</p>
            
        </UContainer>
    </UApp>
</template>
