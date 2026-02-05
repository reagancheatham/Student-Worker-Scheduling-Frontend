<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
    CalendarEventData,
    EventColor,
} from "@classes/calendar/calendarEventData.ts";
import { EventTime } from "@classes/calendar/eventTime.ts";

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
        new EventTime(1, 15, 15),
        new EventTime(1, 20, 30),
        EventColor.Yellow,
    ),
    new CalendarEventData(
        "Fourth Event",
        new EventTime(1, 16, 15),
        new EventTime(1, 21, 30),
        EventColor.Red,
    ),
]);

const canHover = ref<boolean>(true);

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

function onEventResizeBegan(_: CalendarEventData): void {
    canHover.value = false;
}

function onEventResized(event: CalendarEventData): void {
    event.zIndex = event.startTime.getTotalTime();

    calculateBisects();
}

function onEventResizeEnded(_: CalendarEventData): void {
    canHover.value = true;
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

        eventChain.sort(
            (a, b) => a.startTime.getTotalTime() - b.startTime.getTotalTime(),
        );

        for (let j = 0; j < eventChain.length; j++) {
            const event = eventChain[j];

            if (eventBisects.has(event)) {
                const bisectList = eventBisects.get(event);

                // if it has a chain of equal length, choose the chain with the earliest start time
                if (bisectList.length < eventChain.length)
                    eventBisects.set(event, eventChain);
                else if (bisectList.length == eventChain.length) {
                    if (
                        eventChain[0].startTime.isBefore(
                            bisectList[0].startTime,
                        )
                    )
                        eventBisects.set(event, eventChain);
                }
            } else eventBisects.set(event, eventChain);
        }
    }

    eventBisects.keys().forEach((keyEvent) => {
        if (!calculatedBisects.has(keyEvent)) {
            const bisectList = eventBisects.get(keyEvent);

            if (bisectList.length > 1) {
                let index = bisectList.indexOf(keyEvent);

                for (let i = index; i >= 0; i--) {
                    const mappedEvent = bisectList[i];
                    const mappedList = eventBisects.get(mappedEvent);

                    if (mappedList == bisectList) continue;

                    if (!mappedEvent.startTime.isBefore(keyEvent.startTime))
                        continue;

                    // instead of just changing our index, we need to actually reconstruct the bisectList for this event
                    if (mappedList.indexOf(mappedEvent) >= index) index--;
                }

                calculatedBisects.add(keyEvent);

                const leftMargin = index * (100 / bisectList.length);
                const rightMargin =
                    (bisectList.length - 1 - index) * (100 / bisectList.length);

                keyEvent.leftBisectMargin = leftMargin;
                keyEvent.rightBisectMargin = rightMargin;
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
        <CalendarEvent
            v-for="event in events"
            v-bind:data="event"
            v-bind:can-hover="canHover"
            @resize-began="onEventResizeBegan"
            @resized="onEventResized"
            @resize-ended="onEventResizeEnded"
        />
    </div>
</template>
