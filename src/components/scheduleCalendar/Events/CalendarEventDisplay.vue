<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
    CalendarEventData,
    EventColor,
} from "@classes/calendar/calendarEventData.ts";
import { EventTime } from "@classes/calendar/eventTime.ts";

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

const eventBisects: Map<CalendarEventData, number> = new Map<
    CalendarEventData,
    number
>();
const timeEvents: Map<number, CalendarEventData[]> = new Map<
    number,
    CalendarEventData[]
>();

onMounted(() => {
    initializeZIndices();
    calculateBisects();
});

function initializeZIndices(): void {
    events.value.forEach((element) => {
        element.zIndex = element.startTime.getTotalTime();
    });
}

function onEventResized(event: CalendarEventData): void {
    event.zIndex = event.startTime.getTotalTime();

    calculateBisects();
}

function calculateBisects(): void {
    eventBisects.clear();
    timeEvents.clear();

    for (let i = 0; i < events.value.length; i++) {
        const firstEvent = events.value[i];

        for (let i = 0; i < events.value.length; i++) {
            const secondEvent = events.value[i];
            const startTime = firstEvent.startTime.getTotalTime();

            if (firstEvent === secondEvent) continue;
            else if (firstEvent.isBisectable(secondEvent)) {
                if (eventBisects.has(firstEvent))
                    eventBisects.set(
                        firstEvent,
                        eventBisects.get(firstEvent) + 1,
                    );
                else eventBisects.set(firstEvent, 1);

                if (timeEvents.has(startTime))
                    timeEvents.get(startTime).push(firstEvent);
                else timeEvents.set(startTime, [firstEvent]);
            }
        }
    }

    for (let i = 0; i < events.value.length; i++) {
        const event = events.value[i];
        const startTime = event.startTime.getTotalTime();

        if (timeEvents.has(startTime)) {
            const timeArray = timeEvents.get(startTime);

            if (timeArray.length > 1 && timeArray[0] === event) {
                event.bisectIncrement = 0;
                continue;
            }
        }

        if (!eventBisects.has(event)) event.bisectIncrement = 0;
        else event.bisectIncrement = eventBisects.get(event);
    }
}
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
        <CalendarEvent v-bind:data="events[0]" @resized="onEventResized" />
        <CalendarEvent v-bind:data="events[1]" @resized="onEventResized" />
        <CalendarEvent v-bind:data="events[2]" @resized="onEventResized" />
    </div>
</template>
