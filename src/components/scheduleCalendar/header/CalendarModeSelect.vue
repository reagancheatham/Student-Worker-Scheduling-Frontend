<script setup lang="ts">
import { CalendarMode } from "@classes/calendar/calendarMode.ts";

const modes = Object.keys(CalendarMode).filter((k) => isNaN(Number(k)));
const selectedView = defineModel<CalendarMode>();
</script>

<style>
.selectMenuContainer {
    margin-left: auto;
    width: fit-content;
}

.selectMenu {
    min-width: 90px;
    max-width: 120px;
}
</style>

<template>
    <UFormField class="selectMenuContainer" label="View" name="option">
        <USelectMenu class="selectMenu" v-model="selectedView" :items="modes" />
    </UFormField>
</template>
