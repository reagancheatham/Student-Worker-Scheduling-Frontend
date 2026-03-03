<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { Vector2 } from "@classes/util/vector.ts";

const { data, cellSize } = defineProps<{
    data: CalendarData;
    cellSize: Vector2;
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

function getStyle() {
    if (data.selectedView === CalendarMode.Day) {
        return {
            marginBottom: `${0.2 * cellSize.y}px`,
        };
    } else {
        return {
            marginLeft: `0px`,
        };
    }
}
</script>

<style>
.timeContainer {
    pointer-events: none;
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
}

.dayContainer {
    grid-column: 61 / -1;
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
    font-size: clamp(0.7rem, 0.6vw, 0.6vw);
}

.dayLabel {
    grid-column: span 60;
    left: -50%;
    justify-content: center;
    text-align: center;
    align-items: end;
}

.weekLabel {
    grid-row: span 60;
    padding-right: 12px;
    top: 50%;
    justify-content: right;
}
</style>

<template>
    <div :class="containerClasses.get(data.selectedView)!">
        <UBadge
            color="clear"
            :class="labelClasses.get(data.selectedView)"
            :style="getStyle()"
        ></UBadge>
        <UBadge
            color="clear"
            :class="labelClasses.get(data.selectedView)"
            :style="getStyle()"
            v-for="n in 11"
            >{{ n }} AM</UBadge
        >
        <UBadge
            color="clear"
            :class="labelClasses.get(data.selectedView)"
            :style="getStyle()"
            >12 PM</UBadge
        >
        <UBadge
            color="clear"
            :class="labelClasses.get(data.selectedView)"
            :style="getStyle()"
            v-for="n in 11"
            >{{ n }} PM</UBadge
        >
    </div>
</template>
