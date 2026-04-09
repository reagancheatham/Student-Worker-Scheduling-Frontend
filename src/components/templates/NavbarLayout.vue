<script setup lang="ts">
import { isMobileApp } from "@classes/util/isMobile";
import MobileTabs from "@components/MobileTabs.vue";

const isMobile = isMobileApp();
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
                <UAvatar alt="Davey Clonts" />
            </template>
        </UHeader>

        <div class="flex-1">
            <RouterView />
        </div>

        <MobileTabs />
    </div>
</template>
