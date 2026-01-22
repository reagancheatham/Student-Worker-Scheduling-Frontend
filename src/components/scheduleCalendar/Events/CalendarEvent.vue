<script setup lang="ts">
import { computed } from "vue";

// these props are very temporary, we should just pass an event object
const props = defineProps<{
    color: string;
    day: number;
    startHour: number;
    startMinute: number;
    startPeriod: string;
    endHour: number;
    endMinute: number;
    endPeriod: string;
}>();
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
            'grid-area': `calc(60 * (1 + ${startHour}) + ${startMinute}) / calc(1 + ${day}) / span calc(60 * (${endHour} - ${startHour}) + (${endMinute} - ${startMinute})) / span 1`,
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
                :label="`${startHour}:${startMinute} ${startPeriod} - ${endHour}:${endMinute} ${endPeriod}`"
                :ui="{
                    label: 'text-wrap line-clamp-2',
                }"
            />
        </template>
    </UCard>
</template>
