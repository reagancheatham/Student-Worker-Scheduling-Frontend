<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { EventData } from "@classes/calendar/eventData";
import { Vector2 } from "@classes/util/vector.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { CalendarData } from "@classes/calendar/calendarData";
import { ShiftEventData } from "@classes/calendar/shiftEventData";
import { ShiftTemplateEventData } from "@classes/calendar/shiftTemplateEventData.ts";
import { UserClassEventData } from "@classes/calendar/userClassEventData.ts";
import { stringToWeekDay, toWeekIndex } from "@classes/util/weekDay.ts";
import { DateFormatter } from "@internationalized/date";
import { EmployeeUnavailabilityEventData } from "@classes/calendar/employeeUnavailabilityEventData.ts";
import { Employee } from "@classes/database/employee.ts";

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

const relevantEvents = computed(() => {
    const userClassEvents = getUserClassEvents();
    const unavailabilities = getEmployeeUnavailabilities();

    return [
        ...calendarData.refRelevantEvents.value,
        ...unavailabilities,
        ...userClassEvents,
    ];
});

const weekFormatter = new DateFormatter(CalendarData.localeString, {
    weekday: "long",
});
const eventSlots: Map<EventData, EventSlot> = new Map<EventData, EventSlot>();

const displayClasses = new Map<CalendarMode, string>([
    [CalendarMode.Day, "eventContainer dayEventContainer"],
    [CalendarMode.Week, "eventContainer weekEventContainer"],
    [CalendarMode.Month, "eventContainer monthEventContainer"],
]);

watch(relevantEvents, () => {
    initializeZIndices();
    calculateBisects();
});

function getUserClassEvents(): UserClassEventData[] {
    const userClassEvents: UserClassEventData[] = [];

    calendarData.refUserClasses.value.forEach((c) => {
        if (!calendarData.refEmployeeClassFilter.value.includes(c.employee.id))
            return;

        const selectedDate = calendarData.selectedDay.toDate(
            CalendarData.timeZone,
        );

        if (calendarData.selectedView === CalendarMode.Day) {
            if (calendarData.isTemplate && calendarData.selectedTemplateDay) {
                const selectedDay = calendarData.selectedTemplateDay;

                if (!c.weekDays.includes(selectedDay)) return;

                const templateDate = new Date(
                    2026,
                    4,
                    12,
                    selectedDate.getHours(),
                    selectedDate.getMinutes(),
                );

                const eventData = reactive(
                    new UserClassEventData(c, templateDate),
                );
                eventData.templateStartDay = toWeekIndex(selectedDay);
                eventData.templateEndDay = toWeekIndex(selectedDay);
                userClassEvents.push(eventData);
            } else {
                const selectedDay = stringToWeekDay(
                    weekFormatter.format(selectedDate),
                );

                if (
                    !c.weekDays.includes(selectedDay) ||
                    c.startDate > selectedDate ||
                    c.endDate < selectedDate
                )
                    return;

                const eventData = reactive(
                    new UserClassEventData(c, selectedDate),
                );
                userClassEvents.push(eventData);
            }
        } else {
            const weekStart = calendarData.selectedWeek.start;

            c.weekDays.forEach((weekDay) => {
                if (calendarData.isTemplate) {
                    const templateDate = new Date(
                        2026,
                        4,
                        12,
                        selectedDate.getHours(),
                        selectedDate.getMinutes(),
                    );

                    const eventData = reactive(
                        new UserClassEventData(c, templateDate),
                    );
                    eventData.templateStartDay = toWeekIndex(weekDay);
                    eventData.templateEndDay = toWeekIndex(weekDay);
                    userClassEvents.push(eventData);
                } else {
                    const weekIndex = toWeekIndex(weekDay);
                    const eventDate = weekStart.add({ days: weekIndex });

                    const eventData = reactive(
                        new UserClassEventData(
                            c,
                            eventDate.toDate(CalendarData.timeZone),
                        ),
                    );
                    userClassEvents.push(eventData);
                }
            });
        }
    });

    return userClassEvents;
}

function getEmployeeUnavailabilities(): EmployeeUnavailabilityEventData[] {
    const events: EmployeeUnavailabilityEventData[] = [];

    calendarData.refEmployeeUnavailabilities.value.forEach((eu) => {
        if (!calendarData.refEmployeeClassFilter.value.includes(eu.employee.id))
            return;

        const event = new EmployeeUnavailabilityEventData(eu);
        events.push(event);
    });

    return events;
}

function initializeZIndices(): void {
    relevantEvents.value.forEach((element) => {
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

    const sortedEvents: EventData[] = [...relevantEvents.value].sort(
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
    return relevantEvents.value.filter((e) => {
        if (calendarData.selectedView === CalendarMode.Day) {
            const employee1 = getEmployeeForEvent(event);
            const employee2 = getEmployeeForEvent(e);

            if (employee1 && employee2)
                return event.bisects(e) && employee1.id == employee2.id;
            else if (employee1 || employee2) return false;
            else return event.bisects(e);
        } else return event.bisects(e);
    });
}

function getEmployeeForEvent(event: EventData): Employee | undefined {
    if (event instanceof ShiftEventData) return event.shift.employee;
    else if (event instanceof ShiftTemplateEventData)
        return event.template.employee;
    else if (event instanceof UserClassEventData)
        return event.userClass.employee;
    else return undefined;
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
            v-for="event in relevantEvents"
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
