<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { today } from "@internationalized/date";
import { ref } from "vue";

const {
    header,
    editable = false,
    defaultView = CalendarMode.Week,
} = defineProps<{
    header?: boolean;
    editable?: boolean;
    defaultView?: CalendarMode;
}>();

const data = new CalendarData(defaultView, today(CalendarData.timeZone));
const cellSize = ref(Vector2.zero);

const gridClasses = new Map<CalendarMode, string>([
    [CalendarMode.Day, "calendarGrid dayGrid"],
    [CalendarMode.Week, "calendarGrid weekGrid"],
    [CalendarMode.Month, "calendarGrid monthGrid"],
]);

function updateCellSize(size: Vector2): void {
    cellSize.value = size;
}

function getBodyStyle() {
    if (data.selectedView === CalendarMode.Week)
        return {
            marginTop: "8vh",
        };
    else if (!header) {
        return {
            marginTop: "-4vh",
        };
    } else
        return {
            marginTop: "0px",
        };
}
</script>

<style>
.calendarContainer {
    --day-cell-min-width: calc(10px / 60);
    --day-cell-max-width: calc(80px / 60);
    --day-cell-min-height: 10px;
    --day-cell-max-height: 120px;
    --week-cell-min-width: 50px;
    --week-cell-max-width: 240px;
    --week-cell-min-height: calc(10px / 60);
    --week-cell-max-height: calc(30px / 60);

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
        class="calendarContainer"
        :style="{
            marginLeft: `${-0.5 * cellSize.x}px`,
        }"
    >
        <CalendarHeader v-if="header" :data="data" :cell-size="cellSize" />
        <div class="calendarBody" :style="getBodyStyle()">
            <div :class="gridClasses.get(data.selectedView)!">
                <CalendarWeekDayDisplay
                    v-if="data.selectedView === CalendarMode.Week"
                    :data="data"
                />
                <CalendarTimeDisplay
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
</template>
