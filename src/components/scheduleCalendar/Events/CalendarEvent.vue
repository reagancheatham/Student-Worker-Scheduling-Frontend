<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, toRef } from "vue";
import { EventTime } from "../../../classes/calendar/eventTime.ts";
import { MathUtil } from "../../../classes/util/mathUtil.ts";
import { Range } from "../../../classes/util/range.ts";
import { CalendarEventData } from "../../../classes/calendar/calendarEventData.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { CalendarStore } from "@classes/calendar/calendarUtil.ts";

//#region Variables
enum EventState {
    None,
    Resizing,
    Dragging,
}

const props = defineProps<{
    selectedView: CalendarMode;
    data: CalendarEventData;
    canHover: boolean;
    editable?: boolean;
    cellSize: Vector2;
}>();

const emit = defineEmits({
    resizeBegan: () => true,
    resized: (_: CalendarEventData) => true,
    resizeEnded: () => true,
    dragBegan: (_: CalendarEventData) => true,
    dragEnded: (_: CalendarEventData) => true,
});

const MAX_Z_INDEX = 5000;
const FONT_RANGE = new Range(6, 12);
const TITLE_MARGIN_RANGE = new Range(-13.0, -0.1);
const RESIZE_STEP = 5;
const RESIZE_RATIO = 60 / RESIZE_STEP;
const DRAG_THRESHOLD = 0.5;

const element = ref<any>(null);
const elementHeight = ref(0);
const refData = toRef<CalendarEventData>(props.data);
const titleFontSize = ref(FONT_RANGE.max);
const titleMargin = ref(TITLE_MARGIN_RANGE.max);
const isOpen = ref(false);

let state: EventState = EventState.None;
let dragStart: Vector2 = Vector2.zero;
let dragStartTime: EventTime;
let dragEndTime: EventTime;
let resizeTime: EventTime;
let observer: ResizeObserver | null = null;
let resizePointerStart: number;
//#endregion

onMounted(() => {
    const elementValue = element.value.$el;

    if (!elementValue) return;

    observer = new ResizeObserver((entries) => {
        elementHeight.value = entries[0].contentRect.height;
        resizeTitle();
    });

    observer.observe(elementValue);
});

onBeforeUnmount(() => {
    observer?.disconnect();
});

//#region Resize Callbacks
function onPointerDown(evt: PointerEvent): void {
    if (state == EventState.Resizing || !props.editable) return;

    evt.preventDefault();

    dragStartTime = { ...refData.value.startTime };
    dragEndTime = { ...refData.value.endTime };
    dragStart = new Vector2(evt.clientX, evt.clientY);

    (evt.target as HTMLElement).setPointerCapture(evt.pointerId);

    document.addEventListener("pointermove", onPointerMove);
    document.addEventListener("pointerup", onPointerUp);
}

function onPointerMove(evt: PointerEvent): void {
    if (state == EventState.Resizing) return;

    let delta = new Vector2(
        evt.clientX - dragStart.x,
        evt.clientY - dragStart.y,
    );

    if (state == EventState.Dragging) {
        updateDrag(delta);
    } else {
        const dragDistance = delta.magnitude();

        if (dragDistance >= DRAG_THRESHOLD) {
            state = EventState.Dragging;
            dragStartTime = { ...refData.value.startTime };
            dragEndTime = { ...refData.value.endTime };
            isOpen.value = false;
            props.data.zIndex = MAX_Z_INDEX;

            emit("dragBegan", props.data);
        }
    }
}

function updateDrag(delta: Vector2): void {
    let hour = 0;
    let minute = 0;

    if (props.selectedView == CalendarMode.Day) {
        const horizontalDragRatio = props.cellSize.x / RESIZE_RATIO;
        const dX = Math.round(delta.x / horizontalDragRatio) * RESIZE_STEP;

        hour = dragStartTime.hour;
        minute = dragStartTime.minute + dX;
    } else {
        const horizontalDragRatio = props.cellSize.x;
        const verticalDragRatio = props.cellSize.y / RESIZE_RATIO;
        const dY = Math.round(delta.y / verticalDragRatio) * RESIZE_STEP;
        const dX = Math.round(delta.x / horizontalDragRatio);

        hour = dragStartTime.hour;
        minute = dragStartTime.minute + dY;

        let day = dragStartTime.day + dX;
        day = MathUtil.clamp(day, 1, 7);

        refData.value.startTime.day = day;
        refData.value.endTime.day = day;
    }

    const hourDifference = dragEndTime.hour - dragStartTime.hour;
    const minuteDifference = dragEndTime.minute - dragStartTime.minute;
    let [startHour, startMinute] = calculateTimeChange(hour, minute);
    const [endHour, endMinute] = calculateTimeChange(
        startHour + hourDifference,
        startMinute + minuteDifference,
    );

    const targetDifference = 60 * hourDifference + minuteDifference;

    let totalDifference =
        60 * (endHour - startHour) + (endMinute - startMinute);

    if (totalDifference < targetDifference) {
        [startHour, startMinute] = calculateTimeChange(
            endHour - hourDifference,
            endMinute - minuteDifference,
        );

        totalDifference = targetDifference;
    }

    if (totalDifference >= 15) {
        refData.value.startTime.hour = startHour;
        refData.value.startTime.minute = startMinute;
        refData.value.endTime.hour = endHour;
        refData.value.endTime.minute = endMinute;
    }
}

function onPointerUp(_: PointerEvent): void {
    if (state != EventState.Dragging) return;

    state = EventState.None;

    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);

    emit("dragEnded", props.data);
}

function startResize(evt: PointerEvent): void {
    evt.preventDefault();

    resizeTime = { ...refData.value.endTime };
    resizePointerStart =
        props.selectedView === CalendarMode.Day ? evt.clientX : evt.clientY;
    props.data.zIndex = MAX_Z_INDEX;

    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onResize);
    window.addEventListener("pointerup", stopResize, { once: true });

    isOpen.value = false;
    state = EventState.Resizing;

    emit("resizeBegan");
}

function onResize(evt: PointerEvent): void {
    let hour = 0;
    let minute = 0;
    let minuteDifference = 0;

    if (props.selectedView === CalendarMode.Day) {
        const dX =
            Math.round(
                (RESIZE_RATIO * (evt.clientX - resizePointerStart)) /
                    props.cellSize.x,
            ) * RESIZE_STEP;

        hour = resizeTime.hour;
        minute = resizeTime.minute + dX;
    } else {
        const dY =
            Math.round(
                (RESIZE_RATIO * (evt.clientY - resizePointerStart)) /
                    props.cellSize.y,
            ) * RESIZE_STEP;

        hour = resizeTime.hour;
        minute = resizeTime.minute + dY;
    }

    [hour, minute] = calculateTimeChange(hour, minute);

    minuteDifference =
        60 * (hour - refData.value.startTime.hour) +
        (minute - refData.value.startTime.minute);

    if (minuteDifference < 15) return;

    refData.value.endTime.hour = hour;
    refData.value.endTime.minute = minute;

    state = EventState.None;
    emit("resized", props.data);
}

function stopResize(): void {
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", onResize);
    window.removeEventListener("pointerup", stopResize);

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

function resizeTitle(): void {
    const t = Math.min(elementHeight.value / 50, 1.0);
    titleFontSize.value = FONT_RANGE.lerp(t);
    titleMargin.value = TITLE_MARGIN_RANGE.lerp(t);
}

function getGridArea(): string {
    const data = refData.value;
    const startTime = data.startTime;
    const endTime = data.endTime;

    console.log(CalendarStore.selectedDate.day);

    if (props.selectedView == CalendarMode.Day)
        return `${2} / ${60 * (1 + startTime.hour) + startTime.minute} / span ${1 + endTime.day - startTime.day} / span ${60 * (endTime.hour - startTime.hour) + (endTime.minute - startTime.minute)}`;
    else
        return `${60 * (1 + startTime.hour) + startTime.minute} / ${1 + startTime.day - CalendarStore.selectedWeek.start.day } / span ${60 * (endTime.hour - startTime.hour) + (endTime.minute - startTime.minute)} / span ${1 + (endTime.day - startTime.day)}`;
}

function getStyle() {
    let style = {
        "grid-area": getGridArea(),
        "background-color": `var(${props.data.color})`,
        "z-index": `${props.data.zIndex}`,
        "margin-top": `0`,
        "margin-bottom": `0`,
        "margin-left": `0`,
        "margin-right": `0`,
    };

    if (props.selectedView == CalendarMode.Day) {
        style["margin-top"] =
            `${(props.data.leftBisectMargin / 100) * props.cellSize.y}px`;
        style["margin-bottom"] =
            `${(props.data.rightBisectMargin / 100) * props.cellSize.y}px`;
    } else {
        style["margin-left"] = `${props.data.leftBisectMargin}%`;
        style["margin-right"] = `${props.data.rightBisectMargin}%`;
    }

    return style;
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
    position: absolute;
}
</style>

<template>
    <UPopover
        v-model:open="isOpen"
        :content="{ side: 'right' }"
        @update:open="
            () => {
                if (!canHover || !editable) isOpen = false;
            }
        "
    >
        <UCard
            ref="element"
            class="event"
            variant="ghost"
            :style="getStyle()"
            :ui="{
                footer: 'mt-auto',
            }"
            @mouseenter="if (canHover && editable) isOpen = true;"
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
                <div
                    v-if="selectedView === CalendarMode.Day && editable"
                    class="resizeHandle bottom-0 top-0 right-0 cursor-ew-resize"
                    style="width: 8px"
                    @pointerdown="startResize"
                />
            </template>

            <template #footer v-if="selectedView === CalendarMode.Week && editable">
                <div
                    class="resizeHandle bottom-0 left-0 right-0 cursor-ns-resize"
                    style="height: 8px"
                    @pointerdown="startResize"
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
