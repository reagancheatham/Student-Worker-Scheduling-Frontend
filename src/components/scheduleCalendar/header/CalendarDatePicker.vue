<script setup lang="ts">
import {
    CalendarDate,
    DateFormatter,
    getLocalTimeZone,
} from "@internationalized/date";
import { shallowRef } from "vue";

const today = new Date();
const formatter = new DateFormatter("end-US", {
    dateStyle: "medium",
});

const selectedDate = shallowRef(
    new CalendarDate(today.getFullYear(), today.getMonth(), today.getDay()),
);
</script>

<style>
</style>

<template>
    <UPopover>
        <UButton class="h-1/2" color="neutral" variant="subtle" icon="i-lucide-calendar">
            {{
                selectedDate
                    ? formatter.format(selectedDate.toDate(getLocalTimeZone()))
                    : "Select a date"
            }}
        </UButton>

        <template #content>
            <UCalendar v-model="selectedDate" />
        </template>
    </UPopover>
</template>
