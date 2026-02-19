<script setup lang="ts">
import { CalendarMode } from "@classes/calendar/calendarMode.ts";

const modes = Object.keys(CalendarMode).filter((k) => isNaN(Number(k)));
const selectedView = defineModel<CalendarMode>();
</script>

<style>
.selectMenu {
    min-width: 90px;
    max-width: 120px;
}
</style>

<template>
    <USelectMenu class="selectMenu" v-model="selectedView" :items="modes" />
</template>
