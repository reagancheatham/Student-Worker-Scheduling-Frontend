<script setup lang="ts">
import { ref, toRef } from "vue";
import { EventTime, TimePeriod } from "../../../classes/calendar/eventTime.ts";
import { MathUtil } from "../../../classes/util/mathUtil.ts";
import { Range } from "../../../classes/util/range.ts";

type ResizeEvent = (evt: PointerEvent) => void;

const fontRange = new Range(8, 12);
const marginRange = new Range(-10.0, -0.1);

const props = defineProps<{
    color: string;
    startTime: EventTime;
    endTime: EventTime;
}>();

const refStartTime = toRef<EventTime>(props.startTime);
const refEndTime = toRef<EventTime>(props.endTime);
const titleFontSize = ref(fontRange.max);
const titleMargin = ref(marginRange.max);

let resizeStartTime: EventTime;
let resizeStartY: number;
let resizeEndTime: EventTime;
let resizeEndY: number;

function startStartResize(evt: PointerEvent) {
    resizeStartTime = { ...refStartTime.value };
    resizeStartY = evt.clientY;

    startResize(evt, onStartResize, stopStartResize);
}

function onStartResize(evt: PointerEvent) {
    const dy = Math.round((evt.clientY - resizeStartY) / 3.5) * 5;

    let hour = resizeStartTime.hour;
    let minute = resizeStartTime.minute + dy;
    [hour, minute] = calculateTimeChange(hour, minute);

    const minuteDifference =
        60 * (refEndTime.value.hour - hour) +
        (refEndTime.value.minute - minute);

    if (minuteDifference < 15) return;

    resizeTitle(minuteDifference);

    refStartTime.value.hour = hour;
    refStartTime.value.minute = minute;
}

function stopStartResize(evt: PointerEvent) {
    stopResize(onStartResize, stopStartResize);
}

function startEndResize(evt: PointerEvent) {
    resizeEndTime = { ...refEndTime.value };
    resizeEndY = evt.clientY;

    startResize(evt, onEndResize, stopEndResize);
}

function onEndResize(evt: PointerEvent) {
    const dy = Math.round((evt.clientY - resizeEndY) / 3.5) * 5;

    let hour = resizeEndTime.hour;
    let minute = resizeEndTime.minute + dy;
    [hour, minute] = calculateTimeChange(hour, minute);

    const minuteDifference =
        60 * (hour - refStartTime.value.hour) +
        (minute - refStartTime.value.minute);

    if (minuteDifference < 15) return;

    resizeTitle(minuteDifference);

    refEndTime.value.hour = hour;
    refEndTime.value.minute = minute;
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

function calculateTimeChange(hour: number, minute: number): [number, number] {
    if (minute < 0) {
        hour -= 1 - Math.ceil(minute / 60);

        if (hour < 0) minute = 0;
        else {
            minute = 60 + (minute % 60);

            if (minute == 60) {
                hour++;
                minute = 0;
            }
        }
    } else if (minute > 59) {
        hour += Math.floor(minute / 60);
        minute %= 60;
    }

    hour = MathUtil.clamp(hour, 0, 24);
    if (hour >= 24) minute = 0;

    return [hour, minute];
}

function getTimeText(time: EventTime): string {
    let hour = time.hour;
    let minute = time.minute;

    let hourText = "";
    let minuteText = "";
    let periodText = "";

    if (hour > 12) hour -= 12;
    else if (hour == 0) hour = 12;

    hourText = hour.toString();

    if (minute >= 10) minuteText = `${minute}`;
    else minuteText = `0${minute}`;

    if (time.hour == 24 || time.hour < 12) periodText = "AM";
    else periodText = "PM";

    return `${hourText}:${minuteText} ${periodText}`;
}

function resizeTitle(minuteDifference: number): void {
    const t = Math.min((minuteDifference - 15) / 30.0, 1.0);
    titleFontSize.value = fontRange.lerp(t);
    titleMargin.value = marginRange.lerp(t);
}
</script>

<style>
.event {
    border-left-width: 4px;
    border-color: var(--color-sky-600);
    display: flex;
    flex-direction: column;
    padding-left: 10px;
    position: relative;
}

.event * {
    padding: 0px;
}

.resizeHandle {
    height: 8px;
    cursor: ns-resize;
    position: absolute;
    left: 0px;
    right: 0px;
}
</style>

<template>
    <UCard
        ref="event"
        class="event"
        variant="ghost"
        :style="{
            'grid-area': `calc(60 * (1 + ${refStartTime.hour}) + ${refStartTime.minute}) / calc(1 + ${refStartTime.day}) / span calc(60 * (${refEndTime.hour} - ${refStartTime.hour}) + (${refEndTime.minute} - ${refStartTime.minute})) / span calc(1 + ${refEndTime.day - refStartTime.day})`,
            'background-color': `var(${color})`,
        }"
        :ui="{
            footer: 'mt-auto',
        }"
    >
        <template #header>
            <div
                :style="{
                    marginTop: `${titleMargin}px`,
                }"
            >
                <div
                    class="resizeHandle top-0"
                    @pointerdown="startStartResize"
                />
                <UBadge
                    class="text-black select-none"
                    variant="ghost"
                    label="My Event"
                    style="max-width: 100%"
                    :style="{
                        fontSize: `${titleFontSize}px`,
                    }"
                />
            </div>
        </template>

        <template #default>
            <UBadge
                class="font-normal text-gray-800 flex flex-col items-start"
                variant="ghost"
                :label="`${getTimeText(refStartTime)} - ${getTimeText(refEndTime)}`"
                :ui="{
                    label: 'text-wrap line-clamp-2 select-none',
                }"
            />
        </template>

        <template #footer>
            <div class="resizeHandle bottom-0" @pointerdown="startEndResize" />
        </template>
    </UCard>
</template>
