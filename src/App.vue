<script setup lang="ts">
import ScheduleCalendar from './components/scheduleCalendar/ScheduleCalendar.vue';
import ScheduleSidebar from './components/ScheduleSidebar.vue';
</script>

<template>
    <UApp>
        <UMain>
            <UDashboardGroup>
                <ScheduleSidebar />
                <UDashboardPanel>
                    <template #header>
                        <UDashboardNavbar></UDashboardNavbar>
                    </template>

                    <template #body>
                        <ScheduleCalendar />
                    </template>
                </UDashboardPanel>
            </UDashboardGroup>
        </UMain>
        <UFooter />
    </UApp>
</template>
