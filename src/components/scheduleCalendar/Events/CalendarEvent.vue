<script setup lang="ts">
import { useTemplateRef, toRef } from "vue";
import { EventTime, TimePeriod } from "../../../classes/calendar/eventTime.ts";

type ResizeEvent = (evt: PointerEvent) => void;

const event = useTemplateRef("event");

// these props are very temporary, we should just pass an event object
const props = defineProps<{
    color: string;
    startTime: EventTime;
    endTime: EventTime;
}>();

const refStartTime = toRef<EventTime>(props.startTime);
const refEndTime = toRef<EventTime>(props.endTime);

let resizeStartTime: EventTime;
let resizeStartY: number;
let resizeEndTime: EventTime;
let resizeEndY: number;

function startStartResize(evt: PointerEvent) {
    resizeStartTime = refStartTime.value;
    resizeStartY = evt.clientY;

    startResize(evt, onStartResize, stopStartResize);
}

function onStartResize(evt: PointerEvent) {
    const dy = Math.round((evt.clientY - resizeStartY) / 3.5) * 5;
}

function stopStartResize(evt: PointerEvent) {
    stopResize(onStartResize, stopStartResize);
}

function startEndResize(evt: PointerEvent) {
    resizeEndTime = refEndTime.value;
    resizeEndY = evt.clientY;

    startResize(evt, onEndResize, stopEndResize);
}

function onEndResize(evt: PointerEvent) {
    const dy = Math.round((evt.clientY - resizeEndY) / 3.5) * 5;

    let calculatedHour = resizeEndTime.hour;
    let calculatedMinute = resizeEndTime.minute + dy;

    if (calculatedMinute < 0) {
        calculatedHour--;
        calculatedMinute = 60 + (calculatedMinute % 60);
    } else if (calculatedMinute > 59) {
        calculatedHour++;
        calculatedMinute %= 60;
    }

    refEndTime.value.hour = calculatedHour;
    refEndTime.value.minute = calculatedMinute;
}

function stopEndResize(evt: PointerEvent) {
    stopResize(onEndResize, stopEndResize);
}

function startResize(
    evt: PointerEvent,
    resizeEvent: ResizeEvent,
    stopResizeEvent: ResizeEvent,
) {
    evt.preventDefault();

    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", resizeEvent);
    window.addEventListener("pointerup", stopResizeEvent, { once: true });
}

function stopResize(resizeEvent: ResizeEvent, stopResizeEvent: ResizeEvent) {
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", resizeEvent);
    window.removeEventListener("pointerup", stopResizeEvent);
}

function getStartHour(): number {
    let hour = refStartTime.value.hour;

    if (refStartTime.value.period == TimePeriod.PM) hour += 12;

    return hour;
}

function getEndHour(): number {
    let hour = refEndTime.value.hour;

    if (refEndTime.value.period == TimePeriod.PM) hour += 12;

    return hour;
}

function getMinuteText(minute: number): string {
    let text = "";

    if (minute >= 10) text = `${minute}`;
    else text = `0${minute}`;

    return text;
}
</script>

<style>
.event {
    border-left-width: 4px;
    border-color: var(--color-sky-600);
    display: flex;
    flex-direction: column;
    padding-left: 10px;
}

.event * {
    padding: 0px;
}

.resizeHandle {
    width: 200%;
    height: 8px;
    cursor: ns-resize;
    position: relative;
    margin-left: -10px;
}
</style>

<template>
    <UCard
        ref="event"
        class="event"
        variant="ghost"
        :style="{
            'grid-area': `calc(60 * (1 + ${getStartHour()}) + ${refStartTime.minute}) / calc(1 + ${refStartTime.day}) / span calc(60 * (${getEndHour()} - ${getStartHour()}) + (${refEndTime.minute} - ${refStartTime.minute})) / span calc(1 + ${refEndTime.day - refStartTime.day})`,
            'background-color': `var(${color})`,
        }"
        :ui="{
            header: '-mt-0.5',
            footer: 'mt-auto',
        }"
    >
        <template #header>
            <div class="resizeHandle" @pointerdown="startStartResize" />
            <UBadge
                class="font-medium text-black"
                variant="ghost"
                label="My Event"
                style="max-width: 100%"
            />
        </template>

        <template #default>
            <UBadge
                class="font-normal text-gray-800 flex flex-col items-start"
                variant="ghost"
                :label="`${refStartTime.hour}:${getMinuteText(refStartTime.minute)} ${refStartTime.period} - ${refEndTime.hour}:${getMinuteText(refEndTime.minute)} ${refEndTime.period}`"
                :ui="{
                    label: 'text-wrap line-clamp-2',
                }"
            />
        </template>

        <template #footer>
            <div class="resizeHandle" @pointerdown="startEndResize" />
        </template>
    </UCard>
</template>
