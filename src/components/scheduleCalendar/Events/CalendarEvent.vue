<script setup lang="ts">
import { ref, toRef } from "vue";
import { EventTime } from "../../../classes/calendar/eventTime.ts";
import { MathUtil } from "../../../classes/util/mathUtil.ts";
import { Range } from "../../../classes/util/range.ts";
import { CalendarEventData } from "../../../classes/calendar/calendarEventData.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { f } from "vue-router/dist/router-CWoNjPRp.mjs";

//#region Variables
type ResizeEvent = (evt: PointerEvent) => void;
enum EventState {
    None,
    Resizing,
    Dragging,
}

const props = defineProps<{
    data: CalendarEventData;
    canHover: boolean;
    cellSize: number;
}>();

const emit = defineEmits({
    resizeBegan: () => true,
    resized: (_: CalendarEventData) => true,
    resizeEnded: () => true,
    dragBegan: (_: CalendarEventData) => true,
    dragEnded: (_: CalendarEventData) => true,
});

const MAX_Z_INDEX = 5000;
const FONT_RANGE = new Range(8, 12);
const MARGIN_RANGE = new Range(-10.0, -0.1);
const RESIZE_STEP = 5;
const PIXEL_RESIZE_RATIO = 3.5;
const VERTICAL_DRAG_THRESHOLD = 0.5;

const refData = toRef<CalendarEventData>(props.data);
const titleFontSize = ref(FONT_RANGE.max);
const titleMargin = ref(MARGIN_RANGE.max);
const isOpen = ref(false);

let state: EventState = EventState.None;
let dragStart: Vector2 = Vector2.zero;
let dragStartTime: EventTime;
let dragEndTime: EventTime;
let resizeEndTime: EventTime;
let resizeEndY: number;
//#endregion

//#region Resize Callbacks
function onPointerDown(evt: PointerEvent) {
    if (state == EventState.Resizing) return;

    evt.preventDefault();

    dragStartTime = { ...refData.value.startTime };
    dragEndTime = { ...refData.value.endTime };
    dragStart = new Vector2(evt.clientX, evt.clientY);

    (evt.target as HTMLElement).setPointerCapture(evt.pointerId);

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
}

function onPointerMove(evt: PointerEvent) {
    if (state == EventState.Resizing) return;

    const delta = new Vector2(
        evt.clientX - dragStart.x,
        evt.clientY - dragStart.y,
    );

    if (state == EventState.Dragging) {
        const horizontalDragRatio = props.cellSize;
        const dX = Math.round(delta.x / horizontalDragRatio);
        const dY = Math.round(delta.y / PIXEL_RESIZE_RATIO) * RESIZE_STEP;

        const hour = dragStartTime.hour;
        const minute = dragStartTime.minute + dY;
        const hourDifference = dragEndTime.hour - dragStartTime.hour;
        const minuteDifference = dragEndTime.minute - dragStartTime.minute;
        const [startHour, startMinute] = calculateTimeChange(hour, minute);
        const [endHour, endMinute] = calculateTimeChange(
            hour + hourDifference,
            minute + minuteDifference,
        );

        const totalDifference =
            60 * (endHour - startHour) + (endMinute - startMinute);

        if (totalDifference >= 15) {
            refData.value.startTime.hour = startHour;
            refData.value.startTime.minute = startMinute;
            refData.value.endTime.hour = endHour;
            refData.value.endTime.minute = endMinute;

            resizeTitle(totalDifference);
        }

        let day = dragStartTime.day + dX;
        day = MathUtil.clamp(day, 1, 7);

        refData.value.startTime.day = day;
        refData.value.endTime.day = day;
    } else {
        const dragDistance = delta.magnitude();

        if (dragDistance >= VERTICAL_DRAG_THRESHOLD) {
            state = EventState.Dragging;
            dragStartTime = { ...refData.value.startTime };
            dragEndTime = { ...refData.value.endTime };
            isOpen.value = false;
            props.data.zIndex = MAX_Z_INDEX;

            emit("dragBegan", props.data);
        }
    }
}

function onPointerUp(_: PointerEvent) {
    if (state != EventState.Dragging) return;

    state = EventState.None;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);

    emit("dragEnded", props.data);
}

function startEndResize(evt: PointerEvent) {
    evt.preventDefault();

    resizeEndTime = { ...refData.value.endTime };
    resizeEndY = evt.clientY;
    props.data.zIndex = MAX_Z_INDEX;

    startResize(evt, onEndResize, stopEndResize);

    state = EventState.Resizing;
}

function onEndResize(evt: PointerEvent) {
    const dY =
        Math.round((evt.clientY - resizeEndY) / PIXEL_RESIZE_RATIO) *
        RESIZE_STEP;

    let hour = resizeEndTime.hour;
    let minute = resizeEndTime.minute + dY;
    [hour, minute] = calculateTimeChange(hour, minute);

    const minuteDifference =
        60 * (hour - refData.value.startTime.hour) +
        (minute - refData.value.startTime.minute);

    if (minuteDifference < 15) return;

    resizeTitle(minuteDifference);

    refData.value.endTime.hour = hour;
    refData.value.endTime.minute = minute;

    state = EventState.None;
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

    emit("resizeBegan");
}

function stopResize(resizeEvent: ResizeEvent, stopResizeEvent: ResizeEvent) {
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", resizeEvent);
    window.removeEventListener("pointerup", stopResizeEvent);

    emit("resizeEnded");
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
    console.log("resize: " + minuteDifference);

    const t = Math.min((minuteDifference - 15) / 30.0, 1.0);
    titleFontSize.value = FONT_RANGE.lerp(t);
    titleMargin.value = MARGIN_RANGE.lerp(t);
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
            @mouseleave="isOpen = false"
            @pointerdown="onPointerDown"
            @pointerup="onPointerUp"
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
