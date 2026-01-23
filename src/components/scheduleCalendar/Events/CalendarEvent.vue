<script setup lang="ts">
import { EventTime, TimePeriod } from "../../../classes/calendar/eventTime.ts";

// these props are very temporary, we should just pass an event object
const props = defineProps<{
    color: string;
    startTime: EventTime;
    endTime: EventTime;
}>();

function getStartHour(): number {
    let hour = props.startTime.hour;

    if (props.startTime.period == TimePeriod.PM)
        hour += 12;

    return hour;
}

function getEndHour(): number {
    let hour = props.endTime.hour;

    if (props.endTime.period == TimePeriod.PM)
        hour += 12;

    return hour;
}
</script>

<style>
.event {
    border-left-width: 4px;
    border-color: var(--color-sky-600);
    display: flex;
    flex-direction: column;
    padding-left: 10px;
}

.event * {
    padding: 0px;
}
</style>

<template>
    <UCard
        class="event"
        variant="ghost"
        :style="{
            'grid-area': `calc(60 * (1 + ${getStartHour()}) + ${startTime.minute}) / calc(1 + ${startTime.day}) / span calc(60 * (${getEndHour()} - ${getStartHour()}) + (${endTime.minute} - ${startTime.minute})) / span calc(1 + ${endTime.day - startTime.day})`,
            'background-color': `var(${color})`
        }"
    >
        <template #header>
            <UBadge
                class="font-medium text-black"
                variant="ghost"
                label="My Event"
                style="max-width: 100%"
            />
        </template>

        <template #default>
            <UBadge
                class="font-normal text-gray-800 flex flex-col items-start"
                variant="ghost"
                :label="`${startTime.hour}:${startTime.minute} ${startTime.period} - ${endTime.hour}:${endTime.minute} ${endTime.period}`"
                :ui="{
                    label: 'text-wrap line-clamp-2',
                }"
            />
        </template>
    </UCard>
</template>
