<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { Vector2 } from "@classes/util/vector.ts";
import { today } from "@internationalized/date";

const { data, cellSize } = defineProps<{
    data: CalendarData;
    cellSize: Vector2;
}>();

function getStyle() {
    if (data.selectedView === CalendarMode.Day)
        return {
            marginLeft: `${cellSize.x}px`,
        };
    else
        return {
            marginBottom: `12px`,
            marginLeft: `${cellSize.x}px`,
        };
}

function goToToday() {
    data.selectedDay = today(CalendarData.timeZone);
}
</script>

<style>
.headerContainer {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    height: 10%;
}

.headerSegment {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    gap: 12px;
}

.leftSegment {
    margin-left: 0px;
    margin-right: auto;
}

.rightSegment {
    margin-right: 0px;
    margin-left: auto;
}

.formField {
    width: fit-content;
}
</style>

<template>
    <div class="headerContainer" :style="getStyle()">
        <div class="headerSegment leftSegment">
            <CalendarDateShifter :data="data" />
        </div>
        <div class="headerSegment rightSegment">
            <UButton label="Today" variant="outline" color="neutral" @click="goToToday"></UButton>
            <UFormField class="selectMenuContainer" label="Date" name="option">
                <CalendarDatePicker :data="data" />
            </UFormField>
            <UFormField class="selectMenuContainer" label="View" name="option">
                <CalendarModeSelect v-model="data.selectedView" />
            </UFormField>
        </div>
    </div>
</template>
