<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData";
import { DateFormatter } from "@internationalized/date";

const { data } = defineProps<{
    data: CalendarData;
}>();

const weekFormatter = new DateFormatter(CalendarData.locale, {
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
.dayContainer {
    display: grid;
    grid-column: 2 / -1;
    grid-row: 1 / 60;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
}

.dayDisplay {
    display: flex;
    flex-direction: column;
    grid-column: span 1;
    grid-row: span 60;
    justify-content: flex-end;
    align-items: center;
    color: var(--color-gray-500);
    position: relative;
}
</style>

<template>
    <div class="dayContainer">
        <div class="dayDisplay" v-for="n in 7">
            <UBadge
                class="text-primary"
                color="clear"
                size="xl"
                :label="getDayName(n)"
            />
            <UBadge class="text-dimmed" color="clear" size="xl" :label="getDayNumber(n)" />
        </div>
    </div>
</template>
