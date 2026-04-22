<script setup lang="ts">
import { isMobileApp } from "@classes/util/isMobile";
import MobileTabs from "@components/MobileTabs.vue";
import { ref } from "vue";
import ProfileSettingsModal from "../../mobile/modals/ProfileSettingsModal.vue";
import { Store } from "@classes/util/store/store.ts";

const user = ref(Store.userStore.getImmediate());

const isMobile = isMobileApp();
const overlay = useOverlay();
const modal = overlay.create(ProfileSettingsModal);

async function openSettings() {
    const storeUser = user.value;

    if (!storeUser) {
        console.error(`No valid user for settings!`);
        return;
    }

    modal.open({
        user: storeUser,
        onUpdated: (updatedUser) => {
            user.value = updatedUser;
        },
    });
}
</script>

<template>
    <UDashboardGroup v-if="!isMobile">
        <ScheduleSidebar />
        <UDashboardPanel>
            <template #header>
                <ScheduleNavbar />
            </template>

            <template #body class="overflow-hidden!">
                <RouterView />
            </template>
        </UDashboardPanel>
    </UDashboardGroup>

    <div class="flex flex-col min-h-screen" v-if="isMobile">
        <UHeader :toggle="false">
            <template #left>
                <img class="h-10 w-65" src="/mobileOC.png" alt="OC Logo" />
            </template>
            <template #right>
                <UAvatar :alt="user.fullName" @click="openSettings" @updated="" />
            </template>
        </UHeader>

        <div class="flex-1">
            <RouterView />
        </div>

        <MobileTabs />
    </div>
</template>
