<script setup lang="ts">
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { CalendarData } from "@classes/calendar/calendarData";
import { DateFormatter } from "@internationalized/date";
import { ref } from "vue";

const { data } = defineProps<{
    data: CalendarData;
}>();

const locale = CalendarData.localeString;
const timeZone = CalendarData.timeZone;
const formatter = new DateFormatter(locale, {
    dateStyle: "medium",
});
const isOpen = ref(false);

function selectDate(date: any): void {
    if (!date) return;

    const startDay = "start" in date ? date.start : date;
    data.selectedDay = startDay;

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
                data.selectedDay
                    ? formatter.format(
                          data.selectedDay.toDate(timeZone),
                      )
                    : "Select a date"
            }}
        </UButton>

        <template #content>
            <UCalendar
                v-if="data.selectedView === CalendarMode.Day"
                prevent-deselect
                :model-value="data.selectedDay"
                @update:model-value="selectDate"
            />
            <UCalendar
                v-if="data.selectedView === CalendarMode.Week"
                range
                prevent-deselect
                :model-value="data.selectedWeek"
                @update:model-value="selectDate"
            />
        </template>
    </UPopover>
</template>
