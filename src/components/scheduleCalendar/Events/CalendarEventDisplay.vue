<script setup lang="ts">
import { ref } from "vue";
import {
    CalendarEventData,
    EventColor,
} from "@classes/calendar/calendarEventData.ts";
import { EventTime } from "@classes/calendar/eventTime";

const events = ref([
    new CalendarEventData(
        new EventTime(1, 6, 15),
        new EventTime(1, 10, 30),
        EventColor.Blue,
    ),
    new CalendarEventData(
        new EventTime(1, 7, 15),
        new EventTime(1, 9, 30),
        EventColor.Orange,
    ),
    new CalendarEventData(
        new EventTime(2, 16, 15),
        new EventTime(2, 20, 30),
        EventColor.Orange,
    ),
]);
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
        <CalendarEvent v-bind:data="events[0]" @resized="" />
        <CalendarEvent v-bind:data="events[1]" />
        <CalendarEvent v-bind:data="events[2]" />
    </div>
</template>
