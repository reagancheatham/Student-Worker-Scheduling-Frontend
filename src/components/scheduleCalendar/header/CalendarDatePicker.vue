<script setup lang="ts">
import { CalendarUtil } from "@classes/calendar/calendarUtil.ts";
import {
    CalendarDate,
    DateFormatter,
    DateValue,
    startOfWeek,
} from "@internationalized/date";
import { ref } from "vue";

type CalendarRange = {
    start: CalendarDate;
    end: CalendarDate;
};

const locale = CalendarUtil.locale;
const timeZone = CalendarUtil.timeZone;
const formatter = new DateFormatter(locale, {
    dateStyle: "medium",
});

const selectedWeek = ref<CalendarRange>();
const isOpen = ref(false);

selectWeek(CalendarUtil.selectedDate);

function selectWeek(date: any): void {
    if (!date) return;

    const startDay = "start" in date ? date.start : date;

    const start = startOfWeek(startDay as CalendarDate, locale, "mon");
    const end = start.add({ days: 4 });

    selectedWeek.value = { start, end };
    isOpen.value = false;

    CalendarUtil.selectedDate = startDay;
}

function isUnavailable(date: DateValue): boolean {
    return false;
}

function isHighlightable(date: DateValue): boolean {
    return !isUnavailable(date);
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
                selectedWeek
                    ? formatter.format(selectedWeek.start.toDate(timeZone))
                    : "Select a date"
            }}
        </UButton>

        <template #content>
            <UCalendar
                range
                prevent-deselect
                :model-value="selectedWeek"
                :is-date-disabled="isUnavailable"
                :is-date-highlightable="isHighlightable"
                @update:model-value="selectWeek"
            />
        </template>
    </UPopover>
</template>
