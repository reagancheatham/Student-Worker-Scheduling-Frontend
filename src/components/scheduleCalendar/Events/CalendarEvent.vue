<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { EventTime } from "../../../classes/calendar/eventTime.ts";
import { MathUtil } from "../../../classes/util/mathUtil.ts";
import { Range } from "../../../classes/util/range.ts";
import { EventData } from "../../../classes/calendar/eventData.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { ShiftEventData } from "@classes/calendar/shiftEventData.ts";
import { isSameDay, startOfWeek } from "@internationalized/date";
import {
    GetClassFunc,
    GetLabelFunc,
    GetStyleFunc,
    UpdateBackendFunc,
} from "@classes/calendar/eventFunctions.ts";
import { EventStyleData } from "@classes/calendar/eventStyleData.ts";
import { ShiftEvent } from "@classes/calendar/shiftEvent.ts";
import { ShiftTemplateEvent } from "@classes/calendar/shiftTemplateEvent.ts";
import { ShiftTemplateEventData } from "@classes/calendar/shiftTemplateEventData.ts";

//#region Variables
enum EventState {
    None,
    Resizing,
    Dragging,
}

const MAX_Z_INDEX = 999999999;
const FONT_RANGE = new Range(6, 12);
const TITLE_MARGIN_RANGE = new Range(-13.0, -0.1);
const RESIZE_STEP = 5;
const RESIZE_RATIO = 60 / RESIZE_STEP;
const DRAG_THRESHOLD = 5;

const model = defineModel<EventData>({ required: true });

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

const element = ref<any>(null);
const elementHeight = ref(0);
const titleFontSize = ref(FONT_RANGE.max);
const titleMargin = ref(TITLE_MARGIN_RANGE.max);
const isPopoverOpen = ref(false);
const isModalOpen = ref(false);
const getClassImpl = ref<GetClassFunc>();
const getStyleImpl = ref<GetStyleFunc>();
const getLabelImpl = ref<GetLabelFunc>();
const updateBackendImpl = ref<UpdateBackendFunc>();

let state: EventState = EventState.None;
let dragStart: Vector2 = Vector2.zero;
let dragStartTime: EventTime;
let dragEndTime: EventTime;
let templateDragStartTime: number;
let templateDragEndTime: number;
let resizeTime: EventTime;
let observer: ResizeObserver | null = null;
let resizePointerStart: number;
//#endregion

onMounted(() => {
    const elementValue = element.value.$el;

    if (props.calendarData.isTemplate) {
        getClassImpl.value = ShiftTemplateEvent.getClass;
        getStyleImpl.value = ShiftTemplateEvent.getStyle;
        getLabelImpl.value = ShiftTemplateEvent.getLabel;
        updateBackendImpl.value = undefined;
    } else {
        getClassImpl.value = ShiftEvent.getClass;
        getStyleImpl.value = ShiftEvent.getStyle;
        getLabelImpl.value = ShiftEvent.getLabel;
        updateBackendImpl.value = ShiftEvent.updateBackendEvent;
    }

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

// This prevents events from flickering when loading data from backend
function shouldRender(): boolean {
    const calendarData = props.calendarData;
    const startTime = model.value.startTime.calendarDate();

    if (calendarData.selectedView === CalendarMode.Day)
        return isSameDay(startTime, calendarData.selectedDay);
    else {
        return isSameDay(
            startOfWeek(startTime, CalendarData.localeString),
            startOfWeek(calendarData.selectedDay, CalendarData.localeString),
        );
    }
}

//#region Resize Callbacks
function onPointerDown(evt: PointerEvent): void {
    evt.preventDefault();

    if (state == EventState.Resizing || !props.editable) return;

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
            dragStartTime = model.value.startTime.clone();
            dragEndTime = model.value.endTime.clone();
            templateDragStartTime = model.value.templateStartDay;
            templateDragEndTime = model.value.templateEndDay;

            isPopoverOpen.value = false;
            model.value.zIndex = MAX_Z_INDEX;

            emit("dragBegan", model.value);
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

        if (!props.calendarData.isTemplate) {
            const weekStart = props.calendarData.selectedWeek.start;
            const weekEnd = props.calendarData.selectedWeek.end;

            let weekDate = dragStartTime.calendarDate();
            weekDate = weekDate.add({ days: dX });

            if (weekDate < weekStart) weekDate = weekStart;
            else if (weekDate > weekEnd) weekDate = weekEnd;

            const day = weekDate.day;

            model.value.startTime.day = day;
            model.value.endTime.day = day;
        } else {
            const newDayIndex = MathUtil.clamp(
                templateDragStartTime + dX,
                0,
                7,
            );

            model.value.templateStartDay = newDayIndex;
            model.value.templateEndDay = newDayIndex;
        }
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
        model.value.startTime.hour = startHour;
        model.value.startTime.minute = startMinute;
        model.value.endTime.hour = endHour;
        model.value.endTime.minute = endMinute;
    }
}

function onPointerUp(_: PointerEvent): void {
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerup", onPointerUp);

    if (state != EventState.Dragging) {
        if (state == EventState.None && props.editable)
            isModalOpen.value = true;

        return;
    }

    state = EventState.None;

    emit("dragEnded", model.value);
    updateBackendEvent();
}

function startResize(evt: PointerEvent): void {
    evt.preventDefault();

    resizeTime = model.value.endTime.clone();
    resizePointerStart =
        props.calendarData.selectedView === CalendarMode.Day
            ? evt.clientX
            : evt.clientY;
    model.value.zIndex = MAX_Z_INDEX;

    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
    window.addEventListener("pointermove", onResize);
    window.addEventListener("pointerup", stopResize, { once: true });

    isPopoverOpen.value = false;

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
        60 * (hour - model.value.startTime.hour) +
        (minute - model.value.startTime.minute);

    if (minuteDifference < 15) return;

    state = EventState.Resizing;
    model.value.endTime.hour = hour;
    model.value.endTime.minute = minute;

    emit("resized", model.value);
}

function stopResize(): void {
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    window.removeEventListener("pointermove", onResize);
    window.removeEventListener("pointerup", stopResize);

    state = EventState.None;

    emit("resizeEnded");
    updateBackendEvent();
}
//#endregion

function onMouseEnter(): void {
    if (props.canHover && !props.editable) isPopoverOpen.value = true;
    else isPopoverOpen.value = false;
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

function resizeTitle(): void {
    const t = Math.min(elementHeight.value / 50, 1.0);
    titleFontSize.value = FONT_RANGE.lerp(t);
    titleMargin.value = TITLE_MARGIN_RANGE.lerp(t);
}

function getClass(): string {
    if (!getClassImpl.value) return "";

    return getClassImpl.value(getStyleData());
}

function getStyle(): any {
    if (!shouldRender() || !getStyleImpl.value)
        return {
            visibility: "hidden",
        };

    return getStyleImpl.value(getStyleData());
}

function getLabel(): string {
    if (!getLabelImpl.value) return "";

    return getLabelImpl.value(getStyleData());
}

function updateBackendEvent(): void {
    if (!updateBackendImpl.value) return;

    updateBackendImpl.value(getStyleData());
}

function getStyleData(): EventStyleData {
    return new EventStyleData(
        model.value,
        props.calendarData,
        props.cellSize,
        props.editable,
    );
}

function closeModal(): void {
    isModalOpen.value = false;
}

function onEventDeleted(): void {
    props.calendarData.updateRelevantData();
}
</script>

<style>
.event {
    pointer-events: all;
    border-left-width: 4px;
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
        v-model:open="isPopoverOpen"
        :content="{ side: 'right' }"
        @update:open="onMouseEnter"
    >
        <template #content>
            <UCard>
                <template #header>{{ model.name }}</template>
                <template #default>
                    <div>
                        {{ model.startTime.toTimeString() }} -
                        {{ model.endTime.toTimeString() }}
                    </div>
                    <div
                        v-if="
                            model instanceof ShiftEventData &&
                            model.shift.employee
                        "
                    >
                        {{ model.shift.employee.fullName }}
                    </div>
                </template>
            </UCard>
        </template>

        <UCard
            ref="element"
            variant="ghost"
            :class="getClass()"
            :style="getStyle()"
            :ui="{
                footer: 'mt-auto',
            }"
            @mouseenter="onMouseEnter"
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
                        :label="getLabel()"
                        style="max-width: 100%"
                        :style="{
                            fontSize: `${titleFontSize}px`,
                        }"
                    />
                </div>
            </template>
            <!-- SHOULD ADD AN AVATAR TO THE EMPLOYEE AND ALSO DONT NEED TO USE A UBADGE -->
            <template #default>
                <div>
                    <UBadge
                        class="font-normal text-gray-800 flex flex-col items-start"
                        variant="ghost"
                        :label="`${model.startTime.toTimeString()} - ${model.endTime.toTimeString()}`"
                        :ui="{
                            label: 'text-wrap line-clamp-2 select-none',
                        }"
                    />
                    <UBadge
                        v-if="model instanceof ShiftEventData"
                        class="font-normal text-gray-700 flex flex-col items-start"
                        variant="ghost"
                        :label="
                            model.shift.employee
                                ? `${model.shift.employee.firstName} ${model.shift.employee.lastName}`
                                : ''
                        "
                    />
                </div>
                <div
                    v-if="
                        props.calendarData.selectedView === CalendarMode.Day &&
                        editable
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
        <CalendarEventEditor
            :model-value="model"
            :is-open="isModalOpen"
            :data="calendarData"
            @close-requested="closeModal()"
            @event-deleted="onEventDeleted()"
        />
    </UPopover>
</template>
