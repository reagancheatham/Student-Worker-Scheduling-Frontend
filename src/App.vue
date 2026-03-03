<script setup lang="ts">
import { CalendarData } from '@classes/calendar/calendarData.ts';

</script>

<template>
    <UApp :locale="CalendarData.locale">
        <UMain>
            <UDashboardGroup>
                <ScheduleSidebar />
                <UDashboardPanel>
                    <template #header>
                        <ScheduleNavbar/>
                    </template>

                    <template #body class="overflow-hidden!">
                        <!-- <ScheduleCalendar /> -->
                        <RouterView />
                    </template>
                </UDashboardPanel>
            </UDashboardGroup>
        </UMain>
        <UFooter />
    </UApp>
</template>
