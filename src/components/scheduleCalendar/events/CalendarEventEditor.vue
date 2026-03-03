<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { EventData } from "@classes/calendar/eventData.ts";
import { CalendarDate, DateFormatter } from "@internationalized/date";
import { ref, shallowRef } from "vue";

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

const name = ref(getData().name);
const eventDate = shallowRef(getData().startTime.calendarDate());
const startTime = shallowRef(getData().startTime.toTime());
const endTime = shallowRef(getData().endTime.toTime());

function getData() {
    return model.value;
}

function close(): void {
    console.log("open");

    if (!isOpen) {
        name.value = getData().name;
        eventDate.value = getData().startTime.calendarDate();
        startTime.value = getData().startTime.toTime();
        endTime.value 
        return;
    }

    emit("closeRequested");
}

function selectDate(date: CalendarDate): void {
    eventDate.value = date;
}

function submitModalForm(): void {
    // actually apply modal ref values
}
</script>

<template>
    <UModal
        :open="isOpen"
        title="Event Editor"
        description="Edit the details of a calendar event."
        @update:open="close"
    >
        <template #content>
            <div class="p-2 flex flex-row">
                <p class="text-xl font-semibold ml-2">Event Editor</p>
                <UButton
                    class="ml-auto"
                    variant="ghost"
                    color="neutral"
                    icon="i-lucide-x"
                    @click="close"
                />
            </div>
            <div class="p-4">
                <UForm class="flex flex-col gap-4">
                    <UFormField label="Name">
                        <UInput v-model="getData().name" />
                    </UFormField>
                    <UFormField label="Date">
                        <UPopover>
                            <UButton
                                class="h-1/2"
                                color="neutral"
                                variant="subtle"
                                icon="i-lucide-calendar"
                                :label="
                                    formatter.format(
                                        eventDate.toDate(CalendarData.timeZone),
                                    )
                                "
                            >
                            </UButton>

                            <template #content>
                                <UCalendar
                                    prevent-deselect
                                    :model-value="eventDate"
                                    @update:model-value="selectDate"
                                />
                            </template>
                        </UPopover>
                    </UFormField>
                    <div class="flex flex-row gap-4">
                        <UFormField label="Start Time">
                            <UInputTime v-model="startTime" />
                        </UFormField>
                        <p class="mt-auto mb-1.5">-</p>
                        <UFormField label="End Time">
                            <UInputTime v-model="endTime" />
                        </UFormField>
                    </div>
                    <div class="flex flex-row gap-2">
                        <UButton class="ml-auto" type="submit">
                            Submit
                        </UButton>
                        <UButton variant="outline" color="neutral"> Cancel </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UModal>
</template>
