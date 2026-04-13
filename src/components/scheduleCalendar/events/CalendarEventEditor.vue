<script setup lang="ts">
import { EventData } from "@classes/calendar/eventData.ts";
import { ShiftEventData } from "@classes/calendar/shiftEventData";

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
        v-if="model instanceof ShiftEventData"
        v-model="model"
        :is-open="isOpen"
        :creator="creator"
    />
</template>
