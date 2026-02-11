<script setup lang="ts">
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { onMounted, onUnmounted, useTemplateRef } from "vue";

const emit = defineEmits({
    cellSizeChanged: (_: Vector2) => true,
});

const { selectedView } = defineProps<{
    selectedView: CalendarMode;
}>();

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
}

.weekCell {
    grid-column: span 1;
    grid-row: span 60;
}
</style>

<template>
    <div :class="containerClasses.get(selectedView)!">
        <UCard
            :ref="`cells`"
            :class="`${cellClasses.get(selectedView)!} rounded-none ring-gray-600`"
            variant="outline"
            v-for="_ in 7 * 24"
        />
    </div>
</template>
