<script setup lang="ts">
import * as v from "valibot";
import type { ChipProps, FormSubmitEvent } from "@nuxt/ui";
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { EventData } from "@classes/calendar/eventData.ts";
import { EventTime } from "@classes/calendar/eventTime.ts";
import { ShiftEvent } from "@classes/calendar/shiftEvent.ts";
import { DateFormatter, DateValue, Time } from "@internationalized/date";
import { onMounted, ref, shallowRef, watch } from "vue";
import { EventColor } from "@classes/calendar/eventColor.ts";

const model = defineModel<EventData>({
    required: true,
});

const { isOpen } = defineProps<{
    isOpen: boolean;
}>();

const emit = defineEmits({ closeRequested: () => true });

onMounted(() => {
    watch(
        () => isOpen,
        (value) => {
            if (value) {
                state.value.name = getData().name;
                state.value.eventDate = getData().startTime.calendarDate();
                state.value.startTime = getData().startTime.toTime();
                state.value.endTime = getData().endTime.toTime();
            }
        },
    );
});

const formatter = new DateFormatter(CalendarData.localeString, {
    dateStyle: "medium",
});

const vTime = v.object({
    hour: v.number(),
    minute: v.number(),
});

const vColor = v.object({
    label: v.string(),
    value: v.instance(EventColor, "Invalid color"),
    chip: v.object({
        color: v.string(),
    }),
});

const schema = v.pipe(
    v.object({
        name: v.pipe(v.string(), v.nonEmpty("Name is required")),
        eventDate: v.any(),
        startTime: vTime,
        endTime: vTime,
        color: vColor,
    }),
    v.forward(
        v.check(
            (data) =>
                data.startTime.hour * 60 + data.startTime.minute <
                data.endTime.hour * 60 + data.endTime.minute,
            "End time must be after start time",
        ),
        ["endTime"],
    ),
);

type Schema = v.InferOutput<typeof schema>;

type ColorItem = {
    label: string;
    value: EventColor;
    chip: {
        color: string;
    };
};

const state = shallowRef<{
    name: string;
    eventDate: DateValue;
    startTime: Time;
    endTime: Time;
    color: ColorItem;
}>({
    name: getData().name,
    eventDate: getData().startTime.calendarDate(),
    startTime: getData().startTime.toTime(),
    endTime: getData().endTime.toTime(),
    color: {
        label: getData().color.name,
        value: getData().color,
        chip: {
            color: getData().color.semantic,
        },
    },
});

const colors = ref<ColorItem[]>([]);

colors.value = EventColor.colors.map((color) => {
    return {
        label: color.name,
        value: color,
        chip: {
            color: color.semantic,
        },
    };
});

function getData() {
    return model.value;
}

function toggleModal(): void {
    if (!isOpen) return;

    emit("closeRequested");
}

function selectDate(date: DateValue): void {
    state.value.eventDate = date;
}

function submitModalForm(_: FormSubmitEvent<Schema>): void {
    const event = model.value;
    const date = state.value.eventDate;
    const startTime = new Time(
        state.value.startTime.hour,
        state.value.startTime.minute,
    );
    const endTime = new Time(
        state.value.endTime.hour,
        state.value.endTime.minute,
    );

    if (event instanceof ShiftEvent) {
        event.name = state.value.name;

        event.startTime = new EventTime(
            date.year,
            date.month,
            date.day,
            startTime.hour,
            startTime.minute,
        );

        event.endTime = new EventTime(
            date.year,
            date.month,
            date.day,
            endTime.hour,
            endTime.minute,
        );

        event.color = state.value.color.value;

        event.updateBackendEvent();
    }

    toggleModal();
}
</script>

<template>
    <UModal
        :open="isOpen"
        title="Event Editor"
        description="Edit the details of a calendar event."
        @update:open="toggleModal()"
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
                        <UInput v-model="state.name" />
                    </UFormField>
                    <UFormField label="Date" name="eventDate">
                        <UPopover>
                            <UButton
                                class="h-1/2"
                                color="neutral"
                                variant="subtle"
                                icon="i-lucide-calendar"
                                :label="
                                    formatter.format(
                                        state.eventDate.toDate(
                                            CalendarData.timeZone,
                                        ),
                                    )
                                "
                            >
                            </UButton>

                            <template #content>
                                <UCalendar
                                    prevent-deselect
                                    v-model="state.eventDate"
                                    @update:model-value="selectDate"
                                />
                            </template>
                        </UPopover>
                    </UFormField>
                    <UFormField label="Time Range" name="endTime">
                        <div class="flex items-center gap-2">
                            <UInputTime v-model="state.startTime" />
                            <span class="text-gray-400">—</span>
                            <UInputTime v-model="state.endTime" />
                        </div>
                    </UFormField>
                    <UFormField label="Color" name="color">
                        <USelectMenu
                            v-model="state.color"
                            :items="colors"
                            label-key="label"
                        >
                            <template #leading="{ modelValue, ui }">
                                <UChip
                                    v-if="modelValue"
                                    v-bind="modelValue.chip"
                                    inset
                                    standalone
                                    :size="
                                        ui.itemLeadingChipSize() as ChipProps['size']
                                    "
                                    :class="ui.itemLeadingChip()"
                                />
                            </template>
                        </USelectMenu>
                    </UFormField>
                    <div class="flex flex-row gap-2">
                        <UButton class="ml-auto" type="submit">
                            Submit
                        </UButton>
                        <UButton
                            variant="outline"
                            color="neutral"
                            @click="toggleModal()"
                        >
                            Cancel
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UModal>
</template>
