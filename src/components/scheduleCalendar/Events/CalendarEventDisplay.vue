<script setup lang="ts">
import { EventTime } from "../../../classes/calendar/eventTime.ts";
</script>

<style>
.eventContainer {
    width: 100%;
    height: 100%;
    display: grid;
    grid-area: stack-area;
    grid-column: 1 / -1;
    grid-row: 2 / -1;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
    z-index: 1;
    padding: 0;
}
</style>

<template>
    <div class="eventContainer">
        <CalendarEvent
            color="--color-sky-500"
            :start-time="new EventTime(1, 6, 15)"
            :end-time="new EventTime(1, 8, 30)"
        />
        <CalendarEvent
            color="--color-orange-500"
            :start-time="new EventTime(1, 7, 15)"
            :end-time="new EventTime(1, 9, 30)"
        />
        <CalendarEvent
            color="--color-orange-500"
            :start-time="new EventTime(2, 16, 15)"
            :end-time="new EventTime(2, 20, 30)"
        />
    </div>
</template>
