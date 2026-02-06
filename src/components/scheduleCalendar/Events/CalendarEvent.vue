<script setup lang="ts">
import { ref, toRef } from "vue";
import { EventTime } from "../../../classes/calendar/eventTime.ts";
import { MathUtil } from "../../../classes/util/mathUtil.ts";
import { Range } from "../../../classes/util/range.ts";
import { CalendarEventData } from "../../../classes/calendar/calendarEventData.ts";

//#region Variables
type ResizeEvent = (evt: PointerEvent) => void;

const fontRange = new Range(8, 12);
const marginRange = new Range(-10.0, -0.1);
const resizeStep = 5;
const pixelResizeRatio = 3.5;

const props = defineProps<{
    data: CalendarEventData;
    canHover: boolean;
}>();

const refData = toRef<CalendarEventData>(props.data);
const titleFontSize = ref(fontRange.max);
const titleMargin = ref(marginRange.max);
const isOpen = ref(false);

const emit = defineEmits({
    resizeBegan: (_: CalendarEventData) => true,
    resized: (_: CalendarEventData) => true,
    resizeEnded: (_: CalendarEventData) => true,
});

let resizeStartTime: EventTime;
let resizeStartY: number;
let resizeEndTime: EventTime;
let resizeEndY: number;
//#endregion

//#region Resize Callbacks
function startDrag(evt: DragEvent) {
    console.log("drag start");
}

function onDrag(evt: DragEvent) {
    console.log("dragging");
}

function stopDrag(evt: DragEvent) {
    console.log("drag end");
}

function startEndResize(evt: PointerEvent) {
    resizeEndTime = { ...refData.value.endTime };
    resizeEndY = evt.clientY;

    startResize(evt, onEndResize, stopEndResize);
}

function onEndResize(evt: PointerEvent) {
    const dy =
        Math.round((evt.clientY - resizeEndY) / pixelResizeRatio) * resizeStep;

    let hour = resizeEndTime.hour;
    let minute = resizeEndTime.minute + dy;
    [hour, minute] = calculateTimeChange(hour, minute);

    const minuteDifference =
        60 * (hour - refData.value.startTime.hour) +
        (minute - refData.value.startTime.minute);

    if (minuteDifference < 15) return;

    resizeTitle(minuteDifference);

    refData.value.endTime.hour = hour;
    refData.value.endTime.minute = minute;

    emit("resized", props.data);
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

    isOpen.value = false;

    emit("resizeBegan", props.data);
}

function stopResize(resizeEvent: ResizeEvent, stopResizeEvent: ResizeEvent) {
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", resizeEvent);
    window.removeEventListener("pointerup", stopResizeEvent);

    emit("resizeEnded", props.data);
}
//#endregion

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
    <UPopover
        v-model:open="isOpen"
        :content="{ side: 'right' }"
        @update:open="
            () => {
                if (!canHover) isOpen = false;
            }
        "
    >
        <UCard
            ref="event"
            class="event"
            variant="ghost"
            :style="{
                'grid-area': `calc(60 * (1 + ${data.startTime.hour}) + ${data.startTime.minute}) / calc(1 + ${data.startTime.day}) / span calc(60 * (${data.endTime.hour} - ${data.startTime.hour}) + (${data.endTime.minute} - ${data.startTime.minute})) / span calc(1 + ${data.endTime.day - data.startTime.day})`,
                'background-color': `var(${data.color})`,
                'z-index': `${data.zIndex}`,
                'margin-left': `${data.leftBisectMargin}%`,
                'margin-right': `${data.rightBisectMargin}%`,
            }"
            :ui="{
                footer: 'mt-auto',
            }"
            @mouseenter="if (canHover) isOpen = true;"
            @mouseleave="isOpen = false;"
            @dragstart="startDrag"
            @drag="onDrag"
            @dragend="stopDrag"
        >
            <template #header>
                <div
                    :style="{
                        marginTop: `${titleMargin}px`,
                    }"
                >
                    <UBadge
                        class="text-black select-none"
                        variant="ghost"
                        :label="data.name"
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
                    :label="`${data.startTime.toTimeString()} - ${data.endTime.toTimeString()}`"
                    :ui="{
                        label: 'text-wrap line-clamp-2 select-none',
                    }"
                />
            </template>

            <template #footer>
                <div
                    class="resizeHandle bottom-0"
                    @pointerdown="startEndResize"
                />
            </template>
        </UCard>

        <template #content>
            <UCard class="size-48 m-4 inline-flex" variant="ghost">
                <template #header>
                    {{ data.name }}
                </template>

                <template #body>
                    {{ data.startTime.toTimeString() }} -
                    {{ data.endTime.toTimeString() }}
                </template>
            </UCard>
        </template>
    </UPopover>
</template>
