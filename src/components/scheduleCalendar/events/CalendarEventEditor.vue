<script setup lang="ts">
import * as v from "valibot";
import type { FormSubmitEvent } from "@nuxt/ui";
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { EventData } from "@classes/calendar/eventData.ts";
import { EventTime } from "@classes/calendar/eventTime.ts";
import { ShiftEvent } from "@classes/calendar/shiftEvent.ts";
import { CalendarDate, DateFormatter, Time } from "@internationalized/date";
import { reactive, ref, shallowRef } from "vue";

const model = defineModel<EventData>({
    required: true,
});

const { isOpen } = defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits({ closeRequested: () => true });

const formatter = new DateFormatter(CalendarData.locale, {
    dateStyle: "medium",
});

const vTime = v.object({
    hour: v.number(),
    minute: v.number(),
});

const schema = v.pipe(
    v.object({
        name: v.pipe(v.string(), v.nonEmpty("Name is required")),
        eventDate: v.pipe(v.date()),
        startTime: v.pipe(
            v.string(),
            v.nonEmpty("Time is required"),
            v.isoTime(),
        ),
        endTime: v.pipe(
            v.string(),
            v.nonEmpty("Time is required"),
            v.isoTime(),
        ),
    }),
    v.check((data) => {
        if (!data.startTime || !data.endTime) return false;

        return (
            timeStringToTime(data.endTime) > timeStringToTime(data.startTime)
        );
    }, "End time must be after start time"),
);

type Schema = v.InferOutput<typeof schema>;

const state = reactive({
    name: "",
    eventDate: getData().startTime.toDate(),
    startTime: getData().startTime.toIsoTimeString(),
    endTime: getData().endTime.toIsoTimeString(),
});

function timeStringToTime(str: string): Time {
    const [h, m] = str.split(":").map(Number);

    return new Time(h, m);
}

function getData() {
    return model.value;
}

function close(): void {
    if (!isOpen) {
        state.name = getData().name;
        state.eventDate = getData().startTime.toDate();
        state.startTime = getData().startTime.toIsoTimeString();
        state.endTime = getData().endTime.toIsoTimeString();
        return;
    }

    emit("closeRequested");
}

function selectDate(date: any): void {
    state.eventDate = (date as CalendarDate).toDate(CalendarData.timeZone);
}

function submitModalForm(submitEvent: FormSubmitEvent<Schema>): void {
    const event = model.value;
    const date = state.eventDate;
    const startTime = timeStringToTime(state.startTime);
    const endTime = timeStringToTime(state.endTime);

    if (event instanceof ShiftEvent) {
        event.name = state.name;

        event.startTime = new EventTime(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startTime.hour,
            startTime.minute,
        );

        event.endTime = new EventTime(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            endTime.hour,
            endTime.minute,
        );

        event.updateBackendEvent();
    }

    close();
}
</script>

<template>
    <UModal
        :open="isOpen"
        title="Event Editor"
        description="Edit the details of a calendar event."
        @update:open="close()"
    >
        <template #content>
            <div class="p-2 flex flex-row">
                <p class="text-xl font-semibold ml-2">Event Editor</p>
            </div>
            <div class="p-4">
                <UForm
                    :schema="schema"
                    :state="state"
                    class="flex flex-col gap-4"
                    @submit="submitModalForm"
                >
                    <UFormField label="Name" name="name">
                        <UInput v-model="getData().name" />
                    </UFormField>
                    <UFormField label="Date" name="eventDate">
                        <UPopover>
                            <UButton
                                class="h-1/2"
                                color="neutral"
                                variant="subtle"
                                icon="i-lucide-calendar"
                                :label="formatter.format(state.eventDate)"
                            >
                            </UButton>

                            <template #content>
                                <UCalendar
                                    prevent-deselect
                                    @update:model-value="selectDate"
                                />
                            </template>
                        </UPopover>
                    </UFormField>
                    <div class="flex flex-row gap-2">
                        <UFormField label="Start Time" name="startTime">
                            <UInputTime v-model="state.startTime" />
                        </UFormField>
                        <p class="mt-auto mb-1.5">-</p>
                        <UFormField label="End Time" name="endTime">
                            <UInputTime v-model="endTime" />
                        </UFormField>
                    </div>
                    <div class="flex flex-row gap-2">
                        <UButton class="ml-auto" type="submit">
                            Submit
                        </UButton>
                        <UButton
                            variant="outline"
                            color="neutral"
                            @click="close()"
                        >
                            Cancel
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UModal>
</template>
