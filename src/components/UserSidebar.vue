<script setup lang="ts">
import { computed, ref } from "vue";
import AvatarMenu from "./AvatarMenu.vue";
import { AuthServices } from "../services/authServices.ts";
import { useRoute } from "vue-router";

const route = useRoute();

const activeTab = defineModel<"businesses" | "users" | "timeSheets">("activeTab", {
    default: "businesses",
});

const links = computed(() => [
    {
        label: "Businesses",
        icon: "i-lucide-building-2",
        active: activeTab.value === "businesses",
        onSelect: () => (activeTab.value = "businesses"),
    },
    {
        label: "Users",
        icon: "i-lucide-users",
        active: activeTab.value === "users",
        onSelect: () => (activeTab.value = "users"),
    },
    {
        label: "Time Sheets",
        icon: "i-lucide-mail",
        active: activeTab.value === "timeSheets",
        onSelect: () => (activeTab.value = "timeSheets"),
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