<script setup lang="ts">
import { CalendarMode } from "@classes/calendar/calendarMode.ts";

const { selectedView } = defineProps<{
    selectedView: CalendarMode;
}>();

const containerClasses = new Map<CalendarMode, string>([
    [CalendarMode.Day, "timeContainer dayContainer"],
    [CalendarMode.Week, "timeContainer weekContainer"],
    [CalendarMode.Month, "timeContainer monthContainer"],
]);

const labelClasses = new Map<CalendarMode, string>([
    [CalendarMode.Day, "timeLabel dayLabel"],
    [CalendarMode.Week, "timeLabel weekLabel"],
    [CalendarMode.Month, "timeLabel monthLabel"],
]);
</script>

<style>
.timeContainer {
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
}

.dayContainer {
    grid-column: 1 / -1;
    grid-row: 1;
}

.weekContainer {
    grid-column: 1;
    grid-row: 1 / -1;
}

.timeLabel {
    height: 100%;
    width: 100%;
    color: var(--color-gray-500);
    position: relative;
    font-size: clamp(0.6rem, 0.8vw, 0.8vw);
}

.dayLabel {
    grid-column: span 60;
    padding-bottom: 12px;
    left: 50%;
    justify-content: center;
    text-align: center;
}

.weekLabel {
    grid-row: span 60;
    padding-right: 12px;
    top: 50%;
    justify-content: right;
}
</style>

<template>
    <div :class="containerClasses.get(selectedView)!">
        <UBadge color="clear" :class="labelClasses.get(selectedView)"></UBadge>
        <UBadge color="clear" :class="labelClasses.get(selectedView)" v-for="n in 11"
            >{{ n }} AM</UBadge
        >
        <UBadge color="clear" :class="labelClasses.get(selectedView)">12 PM</UBadge>
        <UBadge color="clear" :class="labelClasses.get(selectedView)" v-for="n in 11"
            >{{ n }} PM</UBadge
        >
    </div>
</template>
