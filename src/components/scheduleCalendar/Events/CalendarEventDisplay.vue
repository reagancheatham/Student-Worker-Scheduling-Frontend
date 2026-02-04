<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
    CalendarEventData,
    EventColor,
} from "@classes/calendar/calendarEventData.ts";
import { EventTime } from "@classes/calendar/eventTime.ts";
import { MathUtil } from "@classes/util/mathUtil.ts";

const events = ref([
    new CalendarEventData(
        "First Event",
        new EventTime(1, 6, 15),
        new EventTime(1, 10, 30),
        EventColor.Blue,
    ),
    new CalendarEventData(
        "Second Event",
        new EventTime(1, 7, 15),
        new EventTime(1, 9, 30),
        EventColor.Orange,
    ),
    new CalendarEventData(
        "Third Event",
        new EventTime(1, 16, 15),
        new EventTime(1, 20, 30),
        EventColor.Orange,
    ),
]);

const eventBisects: Map<CalendarEventData, CalendarEventData[]> = new Map<
    CalendarEventData,
    CalendarEventData[]
>();

const calculatedBisects: Set<CalendarEventData> = new Set<CalendarEventData>();

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
    calculatedBisects.clear();

    for (let i = 0; i < events.value.length; i++) {
        const firstEvent = events.value[i];
        let eventChain: CalendarEventData[] = [];
        eventChain.push(firstEvent);

        for (let j = 0; j < events.value.length; j++) {
            const secondEvent = events.value[j];

            if (firstEvent === secondEvent) continue;
            else if (firstEvent.isBisecting(secondEvent))
                eventChain.push(secondEvent);
        }

        eventChain.sort((a, b) => a.zIndex - b.zIndex);

        for (let j = 0; j < eventChain.length; j++) {
            const event = eventChain[j];

            if (eventBisects.has(event)) {
                const bisectList = eventBisects.get(event);

                // if it has a chain of equal length, choose the chain with the earliest start time
                if (bisectList.length < eventChain.length)
                    eventBisects.set(event, eventChain);
                else if (bisectList.length == eventChain.length) {
                    console.log(`first: ${eventChain[0].startTime.getTotalTime()}, second: ${bisectList[0].startTime.getTotalTime()}`)

                    if (
                        eventChain[0].startTime.isBefore(
                            bisectList[0].startTime,
                        )
                    ) {
                        eventBisects.set(event, eventChain);
                        console.log("replace");
                    } // TODO: currently we have a problem when there are two bisects of equal length to choose from
                }
            } else eventBisects.set(event, eventChain);
        }
    }

    eventBisects.keys().forEach((key) => {
        if (!calculatedBisects.has(key)) {
            const bisectList = eventBisects.get(key);

            if (bisectList.length > 1) {
                for (let j = 0; j < bisectList.length; j++) {
                    const event = bisectList[j];
                    calculatedBisects.add(event);

                    const leftMargin = j * (100 / bisectList.length);
                    const rightMargin =
                        (bisectList.length - 1 - j) * (100 / bisectList.length);

                    event.leftBisectMargin = leftMargin;
                    event.rightBisectMargin = rightMargin;
                }
            } else {
                const event = bisectList[0];

                event.leftBisectMargin = 0;
                event.rightBisectMargin = 0;
            }
        }
    });
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
