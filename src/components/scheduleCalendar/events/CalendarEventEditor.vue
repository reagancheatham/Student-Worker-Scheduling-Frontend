<script setup lang="ts">
import { EventData } from "@classes/calendar/eventData.ts";
import { ShiftEvent } from "@classes/calendar/shiftEvent.ts";

const model = defineModel<EventData>({
    required: true,
});

const { isOpen, creator = false } = defineProps<{
    isOpen: boolean;
    creator?: boolean;
}>();
</script>

<template>
    <ShiftEventEditor
        v-if="model instanceof ShiftEvent"
        v-model="model"
        :is-open="isOpen"
        :creator="creator"
    />
</template>
