<script setup lang="ts">
import { EventData } from "@classes/calendar/eventData.ts";
import { ShiftEventData } from "@classes/calendar/shiftEventData";
import { ShiftTemplateEventData } from "@classes/calendar/shiftTemplateEventData.ts";

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
    <TemplateShiftEventEditor
        v-if="model instanceof ShiftTemplateEventData"
        v-model="model"
        :is-open="isOpen"
        :creator="creator"
    />
</template>
