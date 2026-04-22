<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { EventData } from "@classes/calendar/eventData.ts";
import { ShiftEventData } from "@classes/calendar/shiftEventData";
import { ShiftTemplateEventData } from "@classes/calendar/shiftTemplateEventData.ts";

const model = defineModel<EventData>({
    required: true,
});

const {
    isOpen,
    data,
    creator = false,
} = defineProps<{
    isOpen: boolean;
    data: CalendarData;
    creator?: boolean;
}>();

const emit = defineEmits({
    closeRequested: () => true,
    eventDeleted: () => true,
    formSubmitted: () => true,
});
</script>

<template>
    <ShiftEventEditor
        v-if="model instanceof ShiftEventData"
        v-model="model"
        :is-open="isOpen"
        :data="data"
        :creator="creator"
        @close-requested="emit('closeRequested')"
        @event-deleted="emit('eventDeleted')"
        @form-submitted="emit('formSubmitted')"
    />
    <TemplateShiftEventEditor
        v-if="model instanceof ShiftTemplateEventData"
        v-model="model"
        :is-open="isOpen"
        :data="data"
        :creator="creator"
        @close-requested="emit('closeRequested')"
        @event-deleted="emit('eventDeleted')"
        @form-submitted="emit('formSubmitted')"
    />
</template>
