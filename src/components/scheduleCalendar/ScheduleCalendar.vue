<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { today } from "@internationalized/date";
import { onMounted, ref, shallowRef } from "vue";

const {
    header,
    editable = false,
    template = undefined,
    defaultView = CalendarMode.Week,
} = defineProps<{
    header?: boolean;
    editable?: boolean;
    template?: ScheduleTemplate;
    defaultView?: CalendarMode;
}>();

const emit = defineEmits({
    closeRequested: () => true,
});

const data = shallowRef(getInitialCalendarData());
const cellSize = ref(Vector2.zero);

const gridClasses = new Map<CalendarMode, string>([
    [CalendarMode.Day, "calendarGrid dayGrid"],
    [CalendarMode.Week, "calendarGrid weekGrid"],
    [CalendarMode.Month, "calendarGrid monthGrid"],
]);

onMounted(() => {
    data.value.updateRelevantData();
});

function getInitialCalendarData(): CalendarData {
    return template
        ? CalendarData.createTemplate(defaultView, template)
        : CalendarData.create(defaultView, today(CalendarData.timeZone));
}

function updateCellSize(size: Vector2): void {
    cellSize.value = size;
}

function getContainerStyle() {
    if (data.value.selectedView === CalendarMode.Day) return {};
    else
        return {
            marginLeft: `${-0.5 * cellSize.value.x}px`,
        };
}

function getBodyStyle() {
    if (data.value.selectedView === CalendarMode.Day)
        return {
            marginTop: `${-0.45 * cellSize.value.y}px`,
        };
    else
        return {
            paddingTop: `${0.5 * cellSize.value.y}px`,
        };
}

function hasEmployeesToDisplay(): boolean {
    return editable || (!editable && data.value.relevantEmployees.length > 0);
}

function cancelEdit(): void {
    emit("closeRequested");
}
</script>

<style>
.calendarContainer {
    --day-cell-min-width: calc(10px / 60);
    --day-cell-max-width: calc(80px / 60);
    --day-cell-min-height: 40px;
    --day-cell-max-height: 120px;
    --week-cell-min-width: 50px;
    --week-cell-max-width: 240px;
    --week-cell-min-height: calc(30px / 60);
    --week-cell-max-height: calc(35px / 60);

    display: flex;
    flex-direction: column;
    min-height: 10px;
    min-width: 100px;
    height: 100%;
    width: 100%;
}

.calendarBody {
    width: 100%;
    display: flex;
    flex: 1;
    min-height: 0;
    max-height: 100%;
    flex-direction: row;
    overflow-y: auto;
    pointer-events: all;
}

.calendarGrid {
    width: 100%;
    height: 100%;
    display: grid;
    min-height: 0;
    pointer-events: none;
}

.dayGrid {
    grid-template-columns: repeat(
        calc(25 * 60),
        minmax(var(--day-cell-min-width), var(--day-cell-max-width))
    );
    grid-template-rows: repeat(
        5,
        minmax(var(--day-cell-min-height), var(--day-cell-max-height))
    );
}

.weekGrid {
    grid-template-columns: repeat(
        8,
        minmax(var(--week-cell-min-width), var(--week-cell-max-width))
    );
    grid-template-rows: repeat(
        calc(25 * 60),
        minmax(var(--week-cell-min-height), var(--week-cell-max-height))
    );
}
</style>

<template>
    <div
        v-if="data && (data.isTemplate || hasEmployeesToDisplay())"
        class="calendarContainer"
        :style="getContainerStyle()"
    >
        <CalendarHeader v-if="header" :data="data" :cell-size="cellSize" />
        <div class="calendarBody" :style="getBodyStyle()">
            <div :class="gridClasses.get(data.selectedView)!">
                <CalendarWeekDayDisplay
                    v-if="data.selectedView === CalendarMode.Week"
                    :data="data"
                />
                <CalendarTimeDisplay :data="data" :cell-size="cellSize" />
                <CalendarEmployeeDisplay
                    v-if="data.selectedView === CalendarMode.Day"
                    :data="data"
                    :cell-size="cellSize"
                />
                <CalendarCellDisplay
                    :data="data"
                    @cell-size-changed="updateCellSize"
                />
                <CalendarEventDisplay
                    :calendar-data="data"
                    :cellSize="cellSize"
                    :editable="editable"
                />
            </div>
        </div>
    </div>
    <div
        v-else
        class="text-neutral-400 text-lg text-center content-center bg-neutral-100 w-full h-full rounded-md"
    >
        No shifts to display.
    </div>
    <div v-if="data && data.isTemplate">
        <div class="flex mt-10 mr-16 items-end">
            <UButton
                class="ml-auto"
                label="Return to Template Selection"
                size="xl"
                variant="outline"
                color="neutral"
                @click="cancelEdit()"
            />
        </div>
    </div>
</template>
