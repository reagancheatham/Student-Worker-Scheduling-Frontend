<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef, toRef } from "vue";
import { EventTime } from "../../../classes/calendar/eventTime.ts";
import { MathUtil } from "../../../classes/util/mathUtil.ts";
import { Range } from "../../../classes/util/range.ts";
import { EventData } from "../../../classes/calendar/eventData.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { ShiftServices } from "../../../services/shiftServices.ts";
import { ShiftEvent } from "@classes/calendar/shiftEvent.ts";
import { Time } from "@internationalized/date";

//#region Variables
enum EventState {
    None,
    Resizing,
    Dragging,
}

const refData = defineModel<EventData>({ required: true });

const props = defineProps<{
    calendarData: CalendarData;
    canHover: boolean;
    editable?: boolean;
    cellSize: Vector2;
}>();

const emit = defineEmits({
    resizeBegan: () => true,
    resized: (_: EventData) => true,
    resizeEnded: () => true,
    dragBegan: (_: EventData) => true,
    dragEnded: (_: EventData) => true,
});

const MAX_Z_INDEX = Infinity;
const FONT_RANGE = new Range(6, 12);
const TITLE_MARGIN_RANGE = new Range(-13.0, -0.1);
const RESIZE_STEP = 5;
const RESIZE_RATIO = 60 / RESIZE_STEP;
const DRAG_THRESHOLD = 0.5;

const element = ref<any>(null);
const elementHeight = ref(0);
const titleFontSize = ref(FONT_RANGE.max);
const titleMargin = ref(TITLE_MARGIN_RANGE.max);
const isPopoverOpen = ref(false);
const isModalOpen = ref(false);
const modalStartTime = shallowRef(
    refData.value.startTime.toTime()
);
const modalEndTime = shallowRef(
    refData.value.endTime.toTime()
);

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
            dragStartTime = refData.value.startTime.clone();
            dragEndTime = refData.value.endTime.clone();
            isPopoverOpen.value = false;
            refData.value.zIndex = MAX_Z_INDEX;

            emit("dragBegan", refData.value);
        }
    }
}

function updateDrag(delta: Vector2): void {
    let hour = 0;
    let minute = 0;

    if (props.calendarData.selectedView == CalendarMode.Day) {
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

        const weekStart = props.calendarData.selectedWeek.start;
        const weekEnd = props.calendarData.selectedWeek.end;

        let weekDate = dragStartTime.calendarDate();
        weekDate = weekDate.add({ days: dX });

        if (weekDate < weekStart) weekDate = weekStart;
        else if (weekDate > weekEnd) weekDate = weekEnd;

        const day = weekDate.day;

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
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);

    if (state != EventState.Dragging) {
        openModal();
        return;
    }

    state = EventState.None;

    emit("dragEnded", refData.value);
    updateEvent();
}

function startResize(evt: PointerEvent): void {
    evt.preventDefault();

    resizeTime = refData.value.endTime.clone();
    resizePointerStart =
        props.calendarData.selectedView === CalendarMode.Day
            ? evt.clientX
            : evt.clientY;
    refData.value.zIndex = MAX_Z_INDEX;

    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onResize);
    window.addEventListener("pointerup", stopResize, { once: true });

    isPopoverOpen.value = false;
    state = EventState.Resizing;

    emit("resizeBegan");
}

function onResize(evt: PointerEvent): void {
    let hour = 0;
    let minute = 0;
    let minuteDifference = 0;

    if (props.calendarData.selectedView === CalendarMode.Day) {
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
    emit("resized", refData.value);
}

function stopResize(): void {
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", onResize);
    window.removeEventListener("pointerup", stopResize);

    emit("resizeEnded");
    updateEvent();
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

    if (props.calendarData.selectedView == CalendarMode.Day) {
        let row = 1;

        if (refData.value instanceof ShiftEvent) {
            const employeeID = refData.value.shift.employeeID;

            row =
                props.calendarData.relevantEmployees.findIndex(
                    (employee) => employee.id === employeeID,
                ) + 1;
        }

        return `${row} / ${1 + (60 * startTime.hour + startTime.minute)} / span ${1 + endTime.day - startTime.day} / span ${60 * (endTime.hour - startTime.hour) + (endTime.minute - startTime.minute)}`;
    } else
        return `${1 + (60 * startTime.hour + startTime.minute)} / ${1 + startTime.day - props.calendarData.selectedWeek.start.day} / span ${60 * (endTime.hour - startTime.hour) + (endTime.minute - startTime.minute)} / span ${1 + (endTime.day - startTime.day)}`;
}

function getStyle() {
    let style = {
        "grid-area": getGridArea(),
        "background-color": `var(${refData.value.color})`,
        "z-index": `${refData.value.zIndex}`,
        "margin-top": `0`,
        "margin-bottom": `0`,
        "margin-left": `0`,
        "margin-right": `0`,
    };

    if (props.calendarData.selectedView == CalendarMode.Day) {
        style["margin-top"] =
            `${(refData.value.leftBisectMargin / 100) * props.cellSize.y}px`;
        style["margin-bottom"] =
            `${(refData.value.rightBisectMargin / 100) * props.cellSize.y}px`;
    } else {
        style["margin-left"] = `${refData.value.leftBisectMargin}%`;
        style["margin-right"] = `${refData.value.rightBisectMargin}%`;
    }

    return style;
}

function updateEvent() {
    if (refData.value instanceof ShiftEvent) {
        refData.value.updateData();
        ShiftServices.update(refData.value.shift);
    }
}

//#region Modal Callbacks
function openModal() {
    modalStartTime.value = refData.value.startTime.toTime();
    modalEndTime.value = refData.value.endTime.toTime();
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}
//#endregion
</script>

<style>
.event {
    pointer-events: all;
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
    <UModal
        v-model:open="isModalOpen"
        title="Event Editor"
        description="Edit the details of a calendar event."
    >
        <UPopover
            v-model:open="isPopoverOpen"
            :content="{ side: 'right' }"
            @update:open="
                () => {
                    if (!canHover || !editable) isPopoverOpen = false;
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
                @mouseenter="if (canHover && editable) isPopoverOpen = true;"
                @mouseleave="isPopoverOpen = false"
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
                            :label="refData.name"
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
                        :label="`${refData.startTime.toTimeString()} - ${refData.endTime.toTimeString()}`"
                        :ui="{
                            label: 'text-wrap line-clamp-2 select-none',
                        }"
                    />
                    <div
                        v-if="
                            props.calendarData.selectedView ===
                                CalendarMode.Day && editable
                        "
                        class="resizeHandle bottom-0 top-0 right-0 cursor-ew-resize"
                        style="width: 8px"
                        @pointerdown="startResize"
                    />
                </template>

                <template
                    #footer
                    v-if="
                        props.calendarData.selectedView === CalendarMode.Week &&
                        editable
                    "
                >
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
                        {{ refData.name }}
                    </template>

                    <template #body>
                        {{ refData.startTime.toTimeString() }} -
                        {{ refData.endTime.toTimeString() }}
                    </template>
                </UCard>
            </template>
        </UPopover>
        <template #content>
            <div class="p-2 flex flex-row">
                <p class="text-xl font-semibold">Event Editor</p>
                <UButton
                    class="ml-auto"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-x"
                    @click="closeModal"
                />
            </div>
            <div class="p-4">
                <UForm class="flex flex-col gap-4">
                    <UFormField label="Name">
                        <UInput v-model="refData.name" />
                    </UFormField>
                    <div class="flex flex-row gap-4">
                        <UFormField label="Start Time">
                            <UInputTime
                                v-model="modalStartTime"
                            />
                        </UFormField>
                        <p class="mt-auto mb-1.5">-</p>
                        <UFormField label="End Time">
                            <UInputTime
                                v-model="modalEndTime"
                            />
                        </UFormField>
                    </div>
                </UForm>
            </div>
        </template>
    </UModal>
</template>
