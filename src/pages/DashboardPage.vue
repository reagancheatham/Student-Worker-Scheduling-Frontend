<script>
import WorkingCurrently from "../components/dashboardCards/WorkingCurrently.vue";
import OpenShifts from "../components/dashboardCards/OpenShifts.vue";
import NotificationCenter from "../components/dashboardCards/NotificationCenter.vue";
</script>

<style></style>

<template>
    <div class="grid grid-cols-5 gap-4 h-screen min-h-0">
        <!-- Big Side -->
        <div
            class="col-span-4 grid grid-cols-7 grid-rows-[3fr_2fr] gap-4 h-full min-h-0"
        >
            <UPageCard
                class="col-span-7 min-h-0 h-full overflow-clip"
                :ui="{
                    wrapper: 'flex flex-col items-start min-h-0 flex-none',
                    header: 'mb-0',
                }"
            >
                <template #header>
                    <div class="text-base font-semibold">Today's Schedule</div>
                </template>
                <div class="w-full h-full min-h-0 mt-5">
                    <ScheduleCalendar default-view="Day" />
                </div>
            </UPageCard>
            <WorkingCurrently
                class="col-span-4 min-h-0 h-full"
            ></WorkingCurrently>
            <OpenShifts class="col-span-3 min-h-0 h-full"></OpenShifts>
        </div>

        <!-- Little Side -->
        <div class="col-span-1 h-full">
            <NotificationCenter class="h-full"></NotificationCenter>
        </div>
    </div>
</template>
