<script setup lang="ts">
import { onMounted, ref } from "vue";
import {
    CalendarEventData,
    EventColor,
} from "@classes/calendar/calendarEventData.ts";
import { EventTime } from "@classes/calendar/eventTime.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";

type EventSlot = {
    index: number;
    slotCount: number;
    slotSize: number;
};

type BisectEvent = {
    event: CalendarEventData;
    start: number;
    end: number;
};

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
    // new CalendarEventData(
    //     "Third Event",
    //     new EventTime(1, 15, 15),
    //     new EventTime(1, 20, 30),
    //     EventColor.Yellow,
    // ),
    // new CalendarEventData(
    //     "Fourth Event",
    //     new EventTime(1, 16, 15),
    //     new EventTime(1, 21, 30),
    //     EventColor.Red,
    // ),
    // new CalendarEventData(
    //     "Fifth Event",
    //     new EventTime(1, 6, 15),
    //     new EventTime(1, 10, 30),
    //     EventColor.Blue,
    // ),
    // new CalendarEventData(
    //     "Sixth Event",
    //     new EventTime(1, 7, 15),
    //     new EventTime(1, 9, 30),
    //     EventColor.Orange,
    // ),
    // new CalendarEventData(
    //     "Seventh Event",
    //     new EventTime(1, 15, 15),
    //     new EventTime(1, 20, 30),
    //     EventColor.Yellow,
    // ),
    // new CalendarEventData(
    //     "Eighth Event",
    //     new EventTime(1, 16, 15),
    //     new EventTime(1, 21, 30),
    //     EventColor.Purple,
    // ),
]);

const props = defineProps<{
    cellSize: Vector2;
    selectedView: CalendarMode;
}>();

const canHover = ref<boolean>(true);

const eventSlots: Map<CalendarEventData, EventSlot> = new Map<
    CalendarEventData,
    EventSlot
>();

const displayClasses = new Map<CalendarMode, string>([
    [CalendarMode.Day, "eventContainer dayEventContainer"],
    [CalendarMode.Week, "eventContainer weekEventContainer"],
    [CalendarMode.Month, "eventContainer monthEventContainer"],
]);

onMounted(() => {
    initializeZIndices();
    calculateBisects();
});

function initializeZIndices(): void {
    events.value.forEach((element) => {
        element.zIndex = element.startTime.totalTime();
    });
}

function onEventResizeBegan(): void {
    canHover.value = false;
}

function onEventResized(event: CalendarEventData): void {
    event.zIndex = event.startTime.totalTime();
}

function onEventResizeEnded(): void {
    canHover.value = true;

    calculateBisects();
}

function onEventDragBegan(): void {
    canHover.value = false;
}

function onEventDragEnded(event: CalendarEventData): void {
    canHover.value = true;
    event.zIndex = event.startTime.totalTime();

    calculateBisects();
}

function calculateBisects(): void {
    eventSlots.clear();

    const sortedEvents = [...events.value].sort(
        (a, b) => a.startTime.totalTime() - b.startTime.totalTime(),
    );

    for (const event of sortedEvents) {
        if (eventSlots.has(event)) continue;

        const bisectChain = findLongestBisectChain(event);
        for (let i = 0; i < bisectChain.length; i++) {
            const bisectEvent = bisectChain[i];

            if (eventSlots.has(bisectEvent)) continue;

            const takenSlots: number[] = [];
            for (let j = 0; j < bisectChain.length; j++) {
                const takenBisect = bisectChain[j];

                if (eventSlots.has(takenBisect)) {
                    const takenSlot = eventSlots.get(takenBisect)!;
                    takenSlots.push(takenSlot.index);
                }
            }

            takenSlots.sort((a, b) => a - b);
            let targetSlot = 0;

            for (const takenSlot of takenSlots) {
                if (takenSlot > targetSlot) {
                    break;
                } else if (targetSlot == takenSlot) targetSlot++;
            }

            eventSlots.set(bisectEvent, {
                index: targetSlot,
                slotCount: bisectChain.length,
                slotSize: 1,
            });
        }
    }

    expandSlotSizes();

    for (const event of sortedEvents) {
        if (!eventSlots.has(event)) {
            event.leftBisectMargin = 0;
            event.rightBisectMargin = 0;
        } else {
            const slot = eventSlots.get(event)!;
            const leftMargin = slot.index * (100 / slot.slotCount);
            const rightMargin =
                (slot.slotCount - 1 - slot.index) * (100 / slot.slotCount);

            event.leftBisectMargin = leftMargin;
            event.rightBisectMargin = rightMargin;
        }
    }
}

function findLongestBisectChain(event: CalendarEventData): CalendarEventData[] {
    const candidates: BisectEvent[] = getAllBisectingEvents(event).map((e) => ({
        event: e,
        start: Math.max(e.startTime.totalTime(), event.startTime.totalTime()),
        end: Math.min(e.endTime.totalTime(), event.endTime.totalTime()),
    }));

    candidates.sort((a, b) => a.start - b.start);

    let active: BisectEvent[] = [];
    let longest: BisectEvent[] = [];

    for (const candidateEvent of candidates) {
        active = active.filter((e) => e.end >= candidateEvent.start);

        active.push(candidateEvent);

        const minEnd = Math.min(...active.map((e) => e.end));
        const maxStart = Math.max(...active.map((e) => e.start));

        if (maxStart < minEnd) {
            const activeStart = maxStart;
            const longestStart =
                longest.length === 0
                    ? Infinity
                    : Math.min(...longest.map((e) => e.start));
            if (
                active.length > longest.length ||
                (active.length === longest.length && activeStart < longestStart)
            )
                longest = [...active];
        }
    }

    return longest
        .map((n) => n.event)
        .sort((a, b) => a.startTime.totalTime() - b.startTime.totalTime());
}

function getAllBisectingEvents(event: CalendarEventData): CalendarEventData[] {
    return events.value.filter((e) => e.bisects(event));
}

function expandSlotSizes() {
    // for (const [event, slot] of eventSlots) {
    //     const bisectingEvents = getAllBisectingEvents(event);
    //     for (const bisectEvent of bisectingEvents) {
    //         if (bisectEvent === event)
    //             continue;
    //     }
    // }
}
</script>

<style>
.eventContainer {
    width: 100%;
    height: 100%;
    display: grid;
    grid-area: stack-area;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
    z-index: 1;
    padding: 0;
}

.dayEventContainer {
    grid-column: 2 / -1;
    grid-row: 1 / -1;
}

.weekEventContainer {
    grid-column: 1 / -1;
    grid-row: 2 / -1;
}
</style>

<template>
    <div :class="displayClasses.get(selectedView)!">
        <CalendarEvent
            v-for="event in events"
            :data="event"
            :can-hover="canHover"
            :cellSize="cellSize"
            :selected-view="selectedView"
            @resize-began="onEventResizeBegan"
            @resized="onEventResized"
            @resize-ended="onEventResizeEnded"
            @drag-began="onEventDragBegan"
            @drag-ended="onEventDragEnded"
        />
    </div>
</template>
