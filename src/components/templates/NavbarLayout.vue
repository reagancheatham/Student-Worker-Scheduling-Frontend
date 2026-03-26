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
                <!-- <ScheduleCalendar /> -->
                <RouterView />
            </template>
        </UDashboardPanel>
    </UDashboardGroup>

    <div class="flex flex-col min-h-screen" v-if="isMobile">
        <div class="flex-1">
            <RouterView />
        </div>

        <MobileTabs />
    </div>
</template>
