<script setup lang="ts">
import { ParseLocalStorage } from "@classes/util/parseLocalStorage";
import type { DropdownMenuItem } from "@nuxt/ui";
import { computed, ref } from "vue";

defineProps<{
    collapsed?: boolean;
}>();

const localUser = ParseLocalStorage.parseUser()
const user = ref({
    name: `${localUser?.firstName} ${localUser?.lastName}` ,
    avatar: {
        src: localUser?.profilePicture,
        alt: "User",
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
            class="
            data-[state=open]:bg-elevated 
            data-[state=open]:text-black
            text-neutral-100
            hover:text-black"
            :ui="{
                trailingIcon: 'text-neutral',
            }"
        />
    </UDropdownMenu>
</template>
