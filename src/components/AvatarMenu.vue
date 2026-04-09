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
        alt: localUser?.firstName,
    },
});

const usersBusinesses = ref<DropdownMenuItem[]>([{ label: "Loading..." }]);

const items = computed(() => [
    [
        {
            type: "label",
            label: user.value.name,
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
    if (localUser == null) {
        console.log("localUser doesn't exist!");
        return;
    }

    try {
        const result = await BusinessServices.getAllForUser(localUser.id);

        usersBusinesses.value = result.map(
            (business: any): DropdownMenuItem => ({
                label: business.name,
                onSelect: () =>
                    BusinessServices.swapCurrentBusiness(business.id),
            }),
        );
    } catch (error) {
        console.log(`Error fetching businesses: ${error}`);
    }
}

onMounted(() => getBusinesses());
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
