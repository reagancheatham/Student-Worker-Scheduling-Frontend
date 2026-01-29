<script setup lang="ts">
import { EventTime, TimePeriod } from '../../../classes/calendar/eventTime.ts';

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
            :start-time="new EventTime(1, 6, 15, TimePeriod.AM)"
            :end-time="new EventTime(1, 8, 30, TimePeriod.AM)"
        />
        <CalendarEvent
            color="--color-orange-500"
            :start-time="new EventTime(2, 4, 15, TimePeriod.PM)"
            :end-time="new EventTime(2, 8, 30, TimePeriod.PM)"
        />
    </div>
</template>
