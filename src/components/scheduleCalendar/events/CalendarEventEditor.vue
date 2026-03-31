<script setup lang="ts">
import * as v from "valibot";
import type { ChipProps, FormSubmitEvent, TableColumn } from "@nuxt/ui";
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { EventData } from "@classes/calendar/eventData.ts";
import { EventTime } from "@classes/calendar/eventTime.ts";
import { ShiftEvent } from "@classes/calendar/shiftEvent.ts";
import { DateFormatter, DateValue, Time } from "@internationalized/date";
import { onMounted, ref, shallowReactive, watch } from "vue";
import { EventColor } from "@classes/calendar/eventColor.ts";
import { Employee } from "@classes/database/employee.ts";
import { Business } from "@classes/database/business.ts";
import { TaskList } from "@classes/database/taskList.ts";
import { TaskListServices } from "../../../services/taskListServices.ts";
import { Task } from "@classes/database/task.ts";
import { TaskServices } from "../../../services/taskServices.ts";

const model = defineModel<EventData>({
    required: true,
});

const { isOpen, creator = false } = defineProps<{
    isOpen: boolean;
    creator?: boolean;
}>();

const emit = defineEmits({
    closeRequested: () => true,
    formSubmitted: () => true,
    eventDeleted: () => true,
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
        employee: v.optional(v.instance(Employee, "Invalid employee")),
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

const state = shallowReactive<{
    name: string;
    eventDate: DateValue;
    startTime: Time;
    endTime: Time;
    color: ColorItem;
    employee: Employee;
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
    employee:
        getData() instanceof ShiftEvent
            ? (getData() as ShiftEvent).shift.employee
            : undefined,
});

const colors = ref<ColorItem[]>([]);
const taskList = ref<TaskList>();

const formatter = new DateFormatter(CalendarData.localeString, {
    dateStyle: "medium",
});

let taskListPromise: Promise<TaskList>;

const taskColumns = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "completeStatus",
        header: "Complete Status",
    },
    {
        id: "action",
        header: "Action",
    },
];

colors.value = EventColor.colors.map((color) => {
    return {
        label: color.name,
        value: color,
        chip: {
            color: color.semantic,
        },
    };
});

onMounted(() => {
    watch(
        () => isOpen,
        (value) => {
            if (value) {
                state.name = getData().name;
                state.eventDate = getData().startTime.calendarDate();
                state.startTime = getData().startTime.toTime();
                state.endTime = getData().endTime.toTime();
                state.color = {
                    label: getData().color.name,
                    value: getData().color,
                    chip: {
                        color: getData().color.semantic,
                    },
                };
                state.employee =
                    getData() instanceof ShiftEvent
                        ? (getData() as ShiftEvent).shift.employee
                        : undefined;

                if (
                    model.value instanceof ShiftEvent &&
                    model.value.shift.isValid()
                ) {
                    TaskListServices.getOrCreateForShift(
                        model.value.shift.id,
                    ).then((value) => {
                        taskList.value = value;
                    });
                }
            }
        },
    );
});

function getData() {
    return model.value;
}

function toggleModal(): void {
    if (!isOpen) return;

    emit("closeRequested");
}

function selectDate(date: DateValue): void {
    state.eventDate = date;
}

function submitModalForm(_: FormSubmitEvent<Schema>): void {
    const event = model.value;
    const date = state.eventDate;
    const startTime = new Time(state.startTime.hour, state.startTime.minute);
    const endTime = new Time(state.endTime.hour, state.endTime.minute);

    if (event instanceof ShiftEvent) {
        event.name = state.name;

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

        event.color = state.color.value;
        event.shift.employee = state.employee;

        event.updateBackendEvent().then(() => emit("formSubmitted"));
    }

    toggleModal();
}

function deleteEvent(): void {
    (model.value as ShiftEvent).destroy().then(() => emit("eventDeleted"));

    toggleModal();
}

function deleteTask(task: Task): void {
    // Delete task
    TaskServices.delete(task).then(() => {
        let shift = (model.value as ShiftEvent).shift;
        let promise = TaskListServices.getOrCreateForShift(shift.id); // Ask to update task list
        taskListPromise = promise;

        promise.then((newList) => {
            if (taskListPromise === promise) // If this is the most recent update, then update our task list
                taskList.value = newList;
        })
    });
}
</script>

<template>
    <UModal
        :open="isOpen"
        :title="creator ? 'Event Creator' : 'Event Editor'"
        description="Edit the details of a calendar event."
        @update:open="toggleModal()"
    >
        <template #content>
            <div class="p-2 flex flex-row">
                <p class="text-xl font-semibold ml-2">
                    {{ creator ? "Event Creator" : "Event Editor" }}
                </p>
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
                    <div class="flex gap-4">
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
                        <USeparator
                            class="h-8 self-end"
                            orientation="vertical"
                            size="sm"
                            decorative
                        />
                        <UFormField label="Time Range" name="endTime">
                            <div class="flex items-center gap-2">
                                <UInputTime v-model="state.startTime" />
                                <span class="text-gray-400">—</span>
                                <UInputTime v-model="state.endTime" />
                            </div>
                        </UFormField>
                    </div>
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
                    <UFormField label="Assigned Employee" name="employee">
                        <USelectMenu
                            class="min-w-36"
                            v-model="state.employee"
                            :items="Business.current.refEmployees.value"
                            label-key="fullName"
                        ></USelectMenu>
                        <UButton
                            v-if="state.employee"
                            class="ml-1 relative top-0.5"
                            size="xs"
                            variant="subtle"
                            color="neutral"
                            icon="i-lucide-x"
                            @click="state.employee = undefined"
                        />
                    </UFormField>
                    <UFormField label="Task List" name="taskList">
                        <UTable
                            v-if="taskList"
                            class="overflow-y-auto h-48"
                            :data="taskList.tasks"
                            :columns="taskColumns"
                        >
                            <template #action-cell="{ row }">
                                <UButton
                                    color="neutral"
                                    variant="outline"
                                    icon="i-lucide-pencil"
                                    size="sm"
                                />
                                <UButton
                                    color="neutral"
                                    variant="outline"
                                    icon="i-lucide-x"
                                    size="sm"
                                    @click="deleteTask(row.original)"
                                />
                            </template>
                        </UTable>
                    </UFormField>
                    <div class="flex flex-row gap-2">
                        <UButton class="ml-auto" type="submit">
                            Submit
                        </UButton>
                        <UButton
                            v-if="!creator"
                            color="neutral"
                            variant="outline"
                            @click="deleteEvent()"
                        >
                            Delete
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
