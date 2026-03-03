<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { CalendarMode } from "@classes/calendar/calendarMode.ts";
import { Month } from "@classes/util/month.ts";
import { DateFormatter } from "@internationalized/date";

const { data } = defineProps<{
    data: CalendarData;
}>();

const monthFormatter = new DateFormatter(CalendarData.locale, {
    month: "long",
    day: "numeric",
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

function getTimeString(): string {
    if (data.selectedView === CalendarMode.Day)
        return `${monthFormatter.format(data.selectedDay.toDate(CalendarData.timeZone))}, ${data.selectedDay.year}`;
    else {
        const startDay = data.selectedWeek.start.toDate(CalendarData.timeZone);
        const endDay = data.selectedWeek.end.toDate(CalendarData.timeZone);

        if (startDay.getMonth() === endDay.getMonth())
            return `${Month.fromDate(startDay).fullName} ${startDay.getDate()}-${endDay.getDate()}, ${endDay.getFullYear()}`;
        else {
            if (startDay.getFullYear() === endDay.getFullYear())
                return `${Month.fromDate(startDay).fullName} ${startDay.getDate()} - ${Month.fromDate(endDay).fullName} ${endDay.getDate()}, ${endDay.getFullYear()}`;
            else
                return `${Month.fromDate(startDay).fullName} ${startDay.getDate()}, ${startDay.getFullYear()} - ${Month.fromDate(endDay).fullName} ${endDay.getDate()}, ${endDay.getFullYear()}`;
        }
    }
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
        {{ getTimeString() }}
    </label>
</template>
