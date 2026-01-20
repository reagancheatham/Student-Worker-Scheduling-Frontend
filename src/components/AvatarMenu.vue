<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { computed, ref } from "vue";

defineProps<{
    collapsed?: boolean;
}>();

const user = ref({
    name: "Reagan Cheatham",
    avatar: {
        src: "../../public/avatar.png",
        alt: "Reagan Cheatham",
    },
});

const items = computed<DropdownMenuItem[][]>(() => [
    [
        {
            type: "label",
            label: user.value.name,
            avatar: user.value.avatar,
        },
    ],
    [
        {
            label: "Profile",
            icon: "i-lucide-user",
        },
        {
            label: "Log out",
            icon: "i-lucide-log-out",
        },
    ],
]);
</script>

<template>
    <UDropdownMenu
        :items="items"
        :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{
            content: collapsed
                ? 'w-48'
                : 'w-(--reka-dropdown-menu-trigger-width)',
        }"
    >
        <UButton
            v-bind="{
                ...user,
                label: collapsed ? undefined : user?.name,
                trailingIcon: collapsed
                    ? undefined
                    : 'i-lucide-chevrons-up-down',
            }"
            color="neutral"
            variant="ghost"
            block
            :square="collapsed"
            class="data-[state=open]:bg-elevated"
            :ui="{
                trailingIcon: 'text-dimmed'
            }"
        />
    </UDropdownMenu>
</template>
