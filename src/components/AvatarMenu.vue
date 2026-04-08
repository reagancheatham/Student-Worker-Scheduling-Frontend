<script setup lang="ts">
import { Store } from "@classes/util/store.ts";
import type { DropdownMenuItem } from "@nuxt/ui";
import { computed, onMounted, ref } from "vue";
import { AuthServices } from "../services/authServices";
import { BusinessServices } from "../services/businessServices";

defineProps<{
    collapsed?: boolean;
}>();

const localUser = Store.getUser();

const user = ref({
    name: `${localUser?.firstName} ${localUser?.lastName}`,
    avatar: {
        src: localUser?.profilePicture,
        alt: "User",
    },
});

const usersBusinesses = ref<DropdownMenuItem[]>([
    { label: "Loading..." },
]);

const items = computed(() => [
    [
        {
            type: "label",
            label: user.value.name,
            avatar: user.value.avatar,
        },
    ],
    [
        {
            label: "Businesses",
            icon: "i-lucide-users",
            type: "submenu",
            children: usersBusinesses.value,
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
            onSelect: () => AuthServices.logout(),
        },
    ],
]);

async function getBusinesses() {
    if (localUser == null) {
        console.log("localUser doesn't exist!");
        return;
    }
    await BusinessServices.getAllForUser(localUser.id)
        .then((result) => {
            usersBusinesses.value = result.map(
                (business: any): DropdownMenuItem => ({
                    label: business.name,
                    onSelect: () => BusinessServices.swapBusinesses(business.id)
                }),
            );
        })
        .catch((error: any) => {
            console.log(`Error catching businesses: ${error}`);
        });
    console.log(usersBusinesses.value);
}

onMounted(() => getBusinesses());
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
            class="data-[state=open]:bg-elevated data-[state=open]:text-black text-neutral-100 hover:text-black"
            :ui="{
                trailingIcon: 'text-neutral',
            }"
        />
    </UDropdownMenu>
</template>
