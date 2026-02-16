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
}
</style>

<template>
    <div class="headerContainer">
        <CalendarDatePicker />
        <CalendarModeSelect v-if="header" v-model="selectedView" />
    </div>
</template>
