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
    <UDashboardSidebar
        class="sidebar"
        resizable
        collapsible
        :ui="{
            header: 'bg-maroon-500 border-0',
            body: 'bg-maroon-500',
            toggle: 'text-neutral-100 hover:text-primary',
        }"
        :default-size="10"
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

            <UNavigationMenu orientation="vertical" :items="items">
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

    <UDashboardSearch :groups="searchGroups" />
</template>
