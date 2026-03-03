<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { onMounted, onUnmounted, useTemplateRef } from "vue";

const emit = defineEmits({
    cellSizeChanged: (_: Vector2) => true,
});

const { data } = defineProps<{
    data: CalendarData;
}>();

const ROWS_IN_DAY = 4;

const cellElements = useTemplateRef<any[]>("cells");

const containerClasses = new Map<CalendarMode, string>([
    [CalendarMode.Day, "cellContainer dayCellContainer"],
    [CalendarMode.Week, "cellContainer weekCellContainer"],
    [CalendarMode.Month, "cellContainer monthCellContainer"],
]);

const cellClasses = new Map<CalendarMode, string>([
    [CalendarMode.Day, "dayCell"],
    [CalendarMode.Week, "weekCell"],
    [CalendarMode.Month, "monthCell"],
]);

onMounted(() => {
    const cell = cellElements.value?.[0]?.$el;

    const observer = new ResizeObserver(() => {
        const rect = cell.getBoundingClientRect();
        const size = new Vector2(rect.width, rect.height);

        emit("cellSizeChanged", size);
    });

    observer.observe(cell);

    onUnmounted(() => observer.disconnect());
});

function getLanes(): number {
    if (data.selectedView == CalendarMode.Day)
        return data.relevantEmployees.length;
    else return 7;
}

function getBorderStyle(cellIndex: number) {
    let borderTopWidth = "1px",
        borderRightWidth = "1px",
        borderBottomWidth = "1px",
        borderLeftWidth = "0px";

    let borderTopLeftRadius = "0px",
        borderTopRightRadius = "0px",
        borderBottomLeftRadius = "0px",
        borderBottomRightRadius = "0px";

    const cellsInRow = data.selectedView === CalendarMode.Day ? 24 : 7;
    const rows = data.selectedView === CalendarMode.Day ? getLanes() : 24;

    if (cellIndex > cellsInRow) borderTopWidth = "0px";

    if (cellIndex % cellsInRow === 1) borderLeftWidth = "1px";

    if (cellIndex === 1) borderTopLeftRadius = "8px";
    else if (cellIndex === cellsInRow) borderTopRightRadius = "8px";
    else if (cellIndex === cellsInRow * (rows - 1) + 1)
        borderBottomLeftRadius = "8px";
    else if (cellIndex === cellsInRow * rows) borderBottomRightRadius = "8px";

    const style = {
        borderTopWidth,
        borderRightWidth,
        borderBottomWidth,
        borderLeftWidth,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomLeftRadius,
        borderBottomRightRadius,
    };

    return style;
}
</script>

<style>
.cellContainer {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
}

.dayCellContainer {
    grid-column: 61 / -1;
    grid-row: 2 / -1;
}

.weekCellContainer {
    grid-column: 2 / -1;
    grid-row: 61 / -1;
}

.dayCell {
    grid-column: span 60;
    grid-row: span 1;
    border-color: var(--color-gray-400);
}

.weekCell {
    grid-column: span 1;
    grid-row: span 60;
    border-color: var(--color-gray-400);
}
</style>

<template>
    <div :class="containerClasses.get(data.selectedView)!">
        <UCard
            v-for="cellIndex in getLanes() * 24"
            :ref="`cells`"
            :class="`${cellClasses.get(data.selectedView)!} rounded-none`"
            :style="getBorderStyle(cellIndex)"
            variant="ghost"
        />
    </div>
</template>
