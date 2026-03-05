<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { Vector2 } from "@classes/util/vector.ts";

const { data, cellSize } = defineProps<{
    data: CalendarData;
    cellSize: Vector2;
}>();

function getStyle() {
    return {
        marginRight: `${0.1 * cellSize.x}px`,
    };
}
</script>

<style>
.employeeContainer {
    display: grid;
    grid-template-columns: subgrid;
    grid-template-rows: subgrid;
    grid-column: 1 / 61;
    grid-row: 2 / -1;
}

.employeeAvatar {
    grid-row: span 1;
    grid-column: 1 / -1;
    display: flex;
    justify-content: center;
}

.employeePicture {
    flex-shrink: 1;
    min-width: 0px;
    max-width: 100%;
    height: auto;
    align-self: center;
}
</style>

<template>
    <div class="employeeContainer" :style="getStyle()">
        <div v-for="employee in data.relevantEmployees" class="employeeAvatar">
            <UAvatar class="employeePicture" src="avatar.png" />
        </div>
    </div>
</template>
