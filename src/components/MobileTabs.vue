<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { computed } from "vue";
import { useRoute } from "vue-router";
import { routes } from "../routing/routes.ts";

const route = useRoute();

const items = computed(() => [
    {
        label: "Home",
        icon: "i-lucide-house",
        to: routes.MobileLayout.children![0].path,
        active: route.path.includes(routes.MobileLayout.children![0].path),
    },
    {
        label: "Schedule",
        icon: "i-lucide-calendar-fold",
        to: routes.MobileLayout.children![1].path,
        active: route.path.includes(routes.MobileLayout.children![1].path),
    },
    {
        label: "Shift Board",
        icon: "i-lucide-clipboard-list",
        to: routes.MobileLayout.children![2].path,
        active: route.path.includes(routes.MobileLayout.children![2].path),
    },
]);
</script>

<template>
    <!-- TODO: fix glitch in tab sizes -->
    <UNavigationMenu
        :items="items"
        :ui="{
            root: 'justify-around border-t border-default py-2',
            item: 'py-0',
            link: 'flex-col gap-1 px-6',
            linkLeadingIcon: 'size-5',
            linkLabel: 'text-[10px]/3 font-normal',
        }"
        class="w-full fixed bottom-0 bg-maroon-500"
    >
        <template #item="{ item, active }">
            <UIcon
                v-if="item.icon"
                :name="item.icon"
                :class="[
                    'w-5 h-5 shrink-0',
                    active ? 'text-maroon-500' : 'text-neutral-100',
                ]"
            />

            <span :class="[active ? 'text-maroon-500' : 'text-neutral-100']">
                {{ item.label }}
            </span>
        </template>
    </UNavigationMenu>
</template>
