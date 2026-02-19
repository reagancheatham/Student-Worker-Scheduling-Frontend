<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { DateFormatter } from "@internationalized/date";

const { data } = defineProps<{
    data: CalendarData;
}>();

const monthFormatter = new DateFormatter(CalendarData.locale, {
    month: "long",
});

function incrementTime(): void {
    if (data.selectedView === CalendarMode.Day)
        data.selectedDay = data.selectedDay.add({ days: 1 });
    else data.selectedDay = data.selectedDay.add({ weeks: 1 });
}

function decrementTime(): void {
    if (data.selectedView === CalendarMode.Day)
        data.selectedDay = data.selectedDay.subtract({ days: 1 });
    else data.selectedDay = data.selectedDay.subtract({ weeks: 1 });
}
</script>

<template>
    <UButton
        icon="i-lucide-arrow-left"
        color="neutral"
        variant="ghost"
        square
        class="rounded-full"
        @click="decrementTime"
    />
    <UButton
        icon="i-lucide-arrow-right"
        color="neutral"
        variant="ghost"
        square
        class="rounded-full"
        @click="incrementTime"
    />
    <label class="mb-0.5 text-lg font-medium text-neutral-500">
        {{
            monthFormatter.format(
                data.selectedDay.toDate(CalendarData.timeZone),
            )
        }}
        {{ data.selectedDay.year }}
    </label>
</template>
