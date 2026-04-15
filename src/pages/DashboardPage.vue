<script setup lang="ts">
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
</script>

<template>
    <div class="grid grid-cols-5 gap-4 h-screen min-h-0">
        <!-- Big Side -->
        <div
            class="col-span-4 grid grid-cols-7 grid-rows-[3fr_2fr] gap-4 h-full min-h-0"
        >
            <UCard
                class="col-span-7 min-h-0 h-full overflow-clip flex-col"
                :ui="{
                    root: 'flex flex-col h-full',
                    header: 'mb-0 flex-none',
                    body: 'flex min-h-0 p-0'
                }"
            >
                <template #header>
                    <div class="text-base font-semibold">Today's Schedule</div>
                </template>
                <div class="w-full h-full flex min-h-0">
                    <ScheduleCalendar :default-view="CalendarMode.Day" />
                </div>
            </UCard>
            <WorkingCurrently class="col-span-4 min-h-0 h-full" />
            <OpenShifts
                class="col-span-3 min-h-0 h-full"
                title="Open Shifts"
            ></OpenShifts>
        </div>

        <!-- Little Side -->
        <div class="col-span-1 h-full">
            <NotificationCenter class="h-full"></NotificationCenter>
        </div>
    </div>
</template>
