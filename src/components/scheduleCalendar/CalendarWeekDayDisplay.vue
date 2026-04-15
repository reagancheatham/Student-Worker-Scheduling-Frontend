<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData";
import { DateFormatter } from "@internationalized/date";

const { data } = defineProps<{
    data: CalendarData;
}>();

const weekFormatter = new DateFormatter(CalendarData.localeString, {
    weekday: "short",
});

function getDayName(index: number): string {
    const dateString = data.selectedWeek.start
        .add({ days: index - 1 })
        .toDate(CalendarData.timeZone);

    return weekFormatter.format(dateString).toUpperCase();
}

function getDayNumber(index: number): string {
    const dateString = data.selectedWeek.start
        .add({ days: index - 1 })
        .day.toString();

    return dateString;
}
</script>

<style>
.weekDayContainer {
    display: grid;
    grid-column: 2 / -1;
    grid-row: 1 / 60;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
}

.weekDayDisplay {
    display: flex;
    flex-direction: column;
    grid-column: span 1;
    grid-row: span 60;
    justify-content: flex-end;
    align-items: center;
    color: var(--color-gray-500);
    position: relative;
    margin-bottom: 2px;
}
</style>

<template>
    <div class="weekDayContainer">
        <div class="weekDayDisplay" v-for="n in 7">
            <div class="text-primary">{{ getDayName(n) }}</div>
            <div v-if="!data.isTemplate" class="text-dimmed">
                {{ getDayNumber(n) }}
            </div>
        </div>
    </div>
</template>
