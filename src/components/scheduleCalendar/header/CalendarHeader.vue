<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";

const { data } = defineProps<{
    data: CalendarData;
}>();
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
        <CalendarDatePicker :data="data" />
        <CalendarModeSelect v-model="data.selectedView" />
    </div>
</template>
