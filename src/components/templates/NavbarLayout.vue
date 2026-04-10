<script setup lang="ts">
import { isMobileApp } from "@classes/util/isMobile";
import MobileTabs from "@components/MobileTabs.vue";
import { ref } from "vue";
import ProfileSettingsModal from "../../mobile/modals/ProfileSettingsModal.vue";
import { Store } from "@classes/util/store";

const user = Store.getUser();

const isMobile = isMobileApp();
const isSettingsOpen = ref(false);

const overlay = useOverlay();

const modal = overlay.create(ProfileSettingsModal);

async function openSettings() {
    const instance = modal.open({
        user: user,
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
                <UAvatar alt="Davey Clonts" @click="openSettings" />
            </template>
        </UHeader>

        <div class="flex-1">
            <RouterView />
        </div>

        <MobileTabs />
    </div>
</template>
