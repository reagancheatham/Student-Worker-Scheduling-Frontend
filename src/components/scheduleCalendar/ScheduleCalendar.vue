<script setup lang="ts">
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { ref } from "vue";

const {viewSelector, defaultView = CalendarMode.Week} = defineProps<{
    viewSelector?: boolean;
    defaultView?: CalendarMode;
}>();

const cellSize = ref(Vector2.zero);
const selectedView = ref(defaultView);

const gridClasses = new Map<CalendarMode, string>([
    [CalendarMode.Day, "calendarGrid dayGrid"],
    [CalendarMode.Week, "calendarGrid weekGrid"],
    [CalendarMode.Month, "calendarGrid monthGrid"],
]);

function updateCellSize(size: Vector2): void {
    cellSize.value = size;
}
</script>

<style>
.calendarContainer {
    --day-cell-min-width: calc(10px / 60);
    --day-cell-max-width: calc(80px / 60);
    --day-cell-min-height: 10px;
    --day-cell-max-height: 80px;
    --week-cell-min-width: 50px;
    --week-cell-max-width: 240px;
    --week-cell-min-height: calc(10px / 60);
    --week-cell-max-height: calc(40px / 60);

    flex: 1;
    min-height: 10px;
    min-width: 100px;
}

.calendarBody {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
}

.calendarGrid {
    width: 100%;
    height: 100%;
    display: grid;
}

.dayGrid {
    grid-template-columns: repeat(
        calc(25 * 60),
        minmax(var(--day-cell-min-width), var(--day-cell-max-width))
    );
    grid-template-rows: repeat(
        8,
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
    <CalendarModeSelect v-if="viewSelector" v-model="selectedView" />
    <div
        class="calendarContainer"
        :style="{ marginLeft: `${-0.5 * cellSize.x}px` }"
    >
        <div class="calendarBody">
            <div :class="gridClasses.get(selectedView)!">
                <CalendarWeekDayDisplay
                    v-if="selectedView === CalendarMode.Week"
                />
                <CalendarTimeDisplay :selected-view="selectedView" />
                <CalendarCellDisplay
                    :selected-view="selectedView"
                    @cell-size-changed="updateCellSize"
                />
                <CalendarEventDisplay
                    :selected-view="selectedView"
                    :cellSize="cellSize"
                />
            </div>
        </div>
    </div>
</template>
