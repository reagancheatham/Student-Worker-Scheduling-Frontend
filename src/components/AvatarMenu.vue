<script setup lang="ts">
import { Store } from "@classes/util/store/store.ts";
import type { DropdownMenuItem } from "@nuxt/ui";
import { computed, onMounted, ref } from "vue";
import { AuthServices } from "../services/authServices";
import { BusinessServices } from "../services/businessServices";
import { router } from "../routing/router.ts";
import { User } from "@classes/database/user.ts";

defineProps<{
    collapsed?: boolean;
}>();

const user = ref<User>();
const displayUser = ref({
    name: "",
    avatar: {
        src: "" as string | undefined,
        alt: "?" as string | undefined,
    },
});

const usersBusinesses = ref<DropdownMenuItem[]>([{ label: "Loading..." }]);

const items = computed(() => [
    [
        {
            type: "label",
            label: displayUser.value.name,
        },
    ],
    [
        {
            label: "Businesses",
            icon: "i-lucide-users",
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
    if (!user.value) {
        console.log("localUser doesn't exist!");
        return;
    }

    try {
        const result = await BusinessServices.getAllForUser(user.value.id);

        usersBusinesses.value = result.map(
            (business: any): DropdownMenuItem => ({
                label: business.name,
                onSelect: async () => {
                    await BusinessServices.swapCurrentBusiness(business.id);
                    router.go(0);
                },
            }),
        );
    } catch (error) {
        console.log(`Error fetching businesses: ${error}`);
    }
}

onMounted(async () => {
    user.value = await Store.userStore.get();
    displayUser.value = {
        name: `${user.value?.firstName} ${user.value?.lastName}`,
        avatar: {
            src: user.value?.profilePicture,
            alt: user.value?.firstName,
        },
    };

    getBusinesses();
});
</script>

<template>
    <UDropdownMenu
        :items="items as DropdownMenuItem[][]"
        :content="{ align: 'center', collisionPadding: 12 }"
        :ui="{
            content: collapsed
                ? 'w-48'
                : 'w-(--reka-dropdown-menu-trigger-width)',
        }"
    >
        <UButton
            v-bind="{
                ...displayUser,
                label: collapsed ? undefined : displayUser?.name,
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
