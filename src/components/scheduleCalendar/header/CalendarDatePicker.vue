<script setup lang="ts">
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { CalendarStore } from "@classes/calendar/calendarUtil.ts";
import { DateFormatter } from "@internationalized/date";
import { ref } from "vue";

const { selectedView } = defineProps<{
    selectedView: CalendarMode;
}>();

const locale = CalendarStore.locale;
const timeZone = CalendarStore.timeZone;
const formatter = new DateFormatter(locale, {
    dateStyle: "medium",
});
const isOpen = ref(false);

function selectDate(date: any): void {
    if (!date) return;

    const startDay = "start" in date ? date.start : date;
    CalendarStore.selectedDate = startDay;

    isOpen.value = false;
}
</script>

<template>
    <UPopover v-model:open="isOpen">
        <UButton
            class="h-1/2"
            color="neutral"
            variant="subtle"
            icon="i-lucide-calendar"
        >
            {{
                CalendarStore.selectedDate
                    ? formatter.format(
                          CalendarStore.selectedDate.toDate(timeZone),
                      )
                    : "Select a date"
            }}
        </UButton>

        <template #content>
            <UCalendar
                v-if="selectedView === CalendarMode.Day"
                prevent-deselect
                :model-value="CalendarStore.selectedDate"
                @update:model-value="selectDate"
            />
            <UCalendar
                v-if="selectedView === CalendarMode.Week"
                range
                prevent-deselect
                :model-value="CalendarStore.selectedWeek"
                @update:model-value="selectDate"
            />
        </template>
    </UPopover>
</template>
