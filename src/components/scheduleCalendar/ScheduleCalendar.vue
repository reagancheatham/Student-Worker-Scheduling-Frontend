<script setup lang="ts">
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { ref } from "vue";

const cellSize = ref(Vector2.zero);
const selectedView = ref(CalendarMode.Week);

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
    width: fit-content;
    height: fit-content;
    margin-top: 1vh;
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
        minmax(calc(10px / 60), calc(80px / 60))
    );
    grid-template-rows: repeat(8, minmax(50px, 80px));
}

.weekGrid {
    grid-template-columns: repeat(8, minmax(50px, 240px));
    grid-template-rows: repeat(
        calc(25 * 60),
        minmax(calc(10px / 60), calc(40px / 60))
    );
}
</style>

<template>
    <CalendarModeSelect v-model="selectedView" />
    <div class="calendarContainer" :style="{ marginLeft: `${-0.5 * cellSize.x}px` }">
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
                <CalendarEventDisplay :cellSize="cellSize" />
            </div>
        </div>
    </div>
</template>
