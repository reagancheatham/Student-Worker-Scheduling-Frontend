<script setup lang="ts">
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
const selectedView = defineModel<CalendarMode>();
</script>

<style>
.headerContainer {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    gap: 12px;
}
</style>

<template>
    <div class="headerContainer">
        <CalendarDatePicker :selected-view="selectedView" />
        <CalendarModeSelect v-model="selectedView" />
    </div>
</template>
