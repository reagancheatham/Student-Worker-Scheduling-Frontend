<script setup lang="ts">
import { CalendarMode } from "@classes/calendar/calendarMode.ts";

const { header } = defineProps<{
    header: boolean;
}>();

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
        <CalendarDatePicker />
        <CalendarModeSelect v-if="header" v-model="selectedView" />
    </div>
</template>
