<script setup lang="ts">
import { ref, watch } from "vue";
import { EventData } from "@classes/calendar/eventData";
import { Vector2 } from "@classes/util/vector.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { CalendarData } from "@classes/calendar/calendarData";
import { ShiftEvent } from "@classes/calendar/shiftEvent.ts";

type EventSlot = {
    index: number;
    slotCount: number;
    slotSize: number;
};

type BisectEvent = {
    event: EventData;
    start: number;
    end: number;
};

const { calendarData, cellSize, editable } = defineProps<{
    calendarData: CalendarData;
    cellSize: Vector2;
    editable?: boolean;
}>();

const canHover = ref<boolean>(true);

const eventSlots: Map<EventData, EventSlot> = new Map<EventData, EventSlot>();

const displayClasses = new Map<CalendarMode, string>([
    [CalendarMode.Day, "eventContainer dayEventContainer"],
    [CalendarMode.Week, "eventContainer weekEventContainer"],
    [CalendarMode.Month, "eventContainer monthEventContainer"],
]);

watch(calendarData.refRelevantEvents, () => {
    initializeZIndices();
    calculateBisects();
});

function initializeZIndices(): void {
    calendarData.refRelevantEvents.value.forEach((element) => {
        element.zIndex = element.startTime.totalTime();
    });
}

function onEventResizeBegan(): void {
    canHover.value = false;
}

function onEventResized(event: EventData): void {
    event.zIndex = event.startTime.totalTime();
}

function onEventResizeEnded(): void {
    canHover.value = true;

    calculateBisects();
}

function onEventDragBegan(): void {
    canHover.value = false;
}

function onEventDragEnded(event: EventData): void {
    canHover.value = true;
    event.zIndex = event.startTime.totalTime();

    calculateBisects();
}

function calculateBisects(): void {
    eventSlots.clear();

    const sortedEvents: EventData[] = [
        ...calendarData.refRelevantEvents.value,
    ].sort((a, b) => a.startTime.totalTime() - b.startTime.totalTime());

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

function findLongestBisectChain(event: EventData): EventData[] {
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

function getAllBisectingEvents(event: EventData): EventData[] {
    return calendarData.refRelevantEvents.value.filter((e) => {
        if (calendarData.selectedView === CalendarMode.Day) {
            const event1 = event as ShiftEvent;
            const event2 = e as ShiftEvent;

            return (
                event1.bisects(event2) &&
                event1.shift.employee?.id === event2.shift.employee?.id
            );
        } else return event.bisects(e);
    });
}
</script>

<style>
.eventContainer {
    display: grid;
    grid-area: stack-area;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
    z-index: 1;
}

.dayEventContainer {
    grid-column: 61 / -1;
    grid-row: 2 / -1;
}

.weekEventContainer {
    grid-column: 2 / -1;
    grid-row: 61 / -1;
}
</style>

<template>
    <div :class="displayClasses.get(calendarData.selectedView)!">
        <CalendarEvent
            v-for="event in calendarData.refRelevantEvents.value"
            :model-value="event"
            :calendar-data="calendarData"
            :can-hover="canHover"
            :cellSize="cellSize"
            :editable="editable"
            @resize-began="onEventResizeBegan"
            @resized="onEventResized"
            @resize-ended="onEventResizeEnded"
            @drag-began="onEventDragBegan"
            @drag-ended="onEventDragEnded"
        />
    </div>
</template>
