<script setup lang="ts">
import * as v from "valibot";
import {
    useSortable,
    UseSortableReturn,
} from "@vueuse/integrations/useSortable";
import type { ChipProps, FormSubmitEvent } from "@nuxt/ui";
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { EventTime } from "@classes/calendar/eventTime.ts";
import { ShiftEventData } from "@classes/calendar/shiftEventData.ts";
import { DateFormatter, DateValue, Time } from "@internationalized/date";
import {
    onMounted,
    ref,
    shallowReactive,
    useTemplateRef,
    watch,
    WatchHandle,
} from "vue";
import { EventColor } from "@classes/calendar/eventColor.ts";
import { Employee } from "@classes/database/employee.ts";
import { TaskList } from "@classes/database/taskList.ts";
import { TaskListServices } from "../../../services/taskListServices.ts";
import { Task } from "@classes/database/task.ts";
import { TaskServices } from "../../../services/taskServices.ts";
import { EmployeeServices } from "../../../services/employeeServices.ts";
import { Store } from "@classes/util/store.ts";
import { UIIDUtil } from "@classes/util/uiIDUtil.ts";
import { TaskCheckOff } from "@classes/database/taskCheckOff.ts";

//#region
const model = defineModel<ShiftEventData>({
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

const tableElement = useTemplateRef("table");
const formElement = useTemplateRef("form");

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
    employee: Employee | undefined;
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
    employee: getData().shift.employee,
});

const colors = ref<ColorItem[]>([]);
const taskList = ref<TaskList>(new TaskList(0, 0, "Task List", []));
const editedTask = ref<Task>(createDefaultTask());
const isCreatingTask = ref<boolean>(false);
const isTaskEditorOpen = ref<boolean>(false);
const isCancelModalOpen = ref<boolean>(false);
const isDirty = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const employees = ref<Employee[]>([]);
const alreadyPublished = ref<boolean>(false);

const formatter = new DateFormatter(CalendarData.localeString, {
    dateStyle: "medium",
});
const taskColumns = [
    {
        accessorKey: "name",
        header: "Name",
        meta: {
            class: {
                td: "max-w-[200px] truncate whitespace-normal",
            },
        },
    },
    {
        accessorFn: (task: Task) => task.checkOffs.length,
        header: "Check Offs",
    },
    {
        id: "action",
        header: "Action",
    },
];

let deletedTasks: Task[] = [];
let removedCheckOffs: TaskCheckOff[] = [];
let isDirtyHandle: WatchHandle;
let sortableInstance: UseSortableReturn;

colors.value = EventColor.colors.map((color) => {
    return {
        label: color.name,
        value: color,
        chip: {
            color: color.semantic,
        },
    };
});
//#endregion

onMounted(() => {
    deletedTasks = [];
    removedCheckOffs = [];

    watch(() => isOpen, initializeState);

    if (isOpen) initializeState();

    watch(tableElement, (element) => {
        if (element && isOpen) {
            if (!(element.$el instanceof HTMLElement)) return;

            const el = element.$el as HTMLElement;
            if (sortableInstance) sortableInstance.stop();

            sortableInstance = useSortable(
                el.querySelector("tbody"),
                taskList.value.tasks,
                {
                    animation: 150,
                    onUpdate: (e: any) => {
                        const tasks = taskList.value.tasks;
                        const movedItem = tasks.splice(e.oldIndex, 1)[0];

                        tasks.splice(e.newIndex, 0, movedItem);

                        // force Vue to redraw
                        taskList.value.tasks = [...tasks];
                    },
                } as any,
            );
        }
    });
});

async function initializeState() {
    if (!isOpen) return;

    const business = await Store.getBusiness();

    if (!business) return;

    alreadyPublished.value = getData().shift.published;
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
    state.employee = getData().shift.employee;

    if (model.value.shift.isValid()) {
        taskList.value = await TaskListServices.getOrCreateForShift(
            model.value.shift.id,
        );
    } else taskList.value = new TaskList(0, 0, "Task List", []);

    employees.value = await EmployeeServices.getAllForBusiness(business.id);

    initializeTaskUIIDs();

    isDirty.value = false;
    isDirtyHandle = watch(state, () => (isDirty.value = true), {
        deep: true,
    });
}

function initializeTaskUIIDs() {
    taskList.value.tasks.forEach((task) => {
        if (!(task as any)._uiID) UIIDUtil.attachUUID(task, "task");
    });
}

function getData() {
    return model.value;
}

function toggleModal(): void {
    if (!isOpen) return;

    deletedTasks = [];
    removedCheckOffs = [];
    if (isDirtyHandle) isDirtyHandle();
    isSubmitting.value = false;
    isCancelModalOpen.value = false;

    emit("closeRequested");
}

function selectDate(date: DateValue | any): void {
    state.eventDate = date;
}

async function submitModalForm(_: FormSubmitEvent<Schema>) {
    isSubmitting.value = true;

    console.log("submitting!");

    const event = model.value;
    const date = state.eventDate;
    const startTime = new Time(state.startTime.hour, state.startTime.minute);
    const endTime = new Time(state.endTime.hour, state.endTime.minute);

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

    const removeCheckPromises = removedCheckOffs.map(async (check) => {
        if (check.id > 0) return await TaskServices.deleteCheckOff(check);
    });

    const taskPromises = deletedTasks.map(async (task) => {
        if (task.isValid()) return await TaskServices.delete(task);
    });

    const totalPromises = [...removeCheckPromises, ...taskPromises];
    await Promise.all(totalPromises);
    let updatedShift = await event.updateBackend();
    await taskList.value.updateBackend(updatedShift);

    emit("formSubmitted");

    toggleModal();
}

function cancelEventEdit(): void {
    if (isDirty.value) isCancelModalOpen.value = true;
    else toggleModal();
}

function deleteEvent(): void {
    model.value.destroy().then(() => emit("eventDeleted"));

    toggleModal();
}

function openAddTaskModal(): void {
    isCreatingTask.value = true;
    editedTask.value = createDefaultTask();
    isTaskEditorOpen.value = true;
}

function onTaskAddRequested(): void {
    UIIDUtil.attachUUID(editedTask.value, "task");

    editedTask.value.listOrder = taskList.value.tasks.length;
    taskList.value.tasks.push(editedTask.value);
    editedTask.value = createDefaultTask();
    isDirty.value = true;
}

function removeCheckOffs(checkOffs: TaskCheckOff[]): void {
    removedCheckOffs = [...removedCheckOffs, ...checkOffs];
}

function editTask(task: Task): void {
    editedTask.value = task;
    isCreatingTask.value = false;
    isTaskEditorOpen.value = true;
}

function deleteTask(task: Task): void {
    deletedTasks.push(task);
    const tasks = taskList.value.tasks;
    tasks.splice(tasks.indexOf(task), 1);
}

function closeTaskModal(): void {
    isTaskEditorOpen.value = false;
}

function createDefaultTask(): Task {
    return new Task(0, taskList.value.id, 0, "New Task", "", []);
}

function publishShift(): void {
    model.value.shift.published = true;
}
</script>

<template>
    <UModal
        :open="isOpen"
        :title="creator ? 'Shift Creator' : 'Shift Editor'"
        :dismissible="false"
        description="Edit the details of a shift."
        @update:open="toggleModal()"
    >
        <template #content>
            <div class="p-2 flex flex-row">
                <p class="text-xl font-semibold ml-2">
                    {{ creator ? "Shift Creator" : "Shift Editor" }}
                </p>
            </div>
            <div class="p-4">
                <UForm
                    ref="form"
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
                            :items="employees"
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
                    <UFormField name="taskList">
                        <div
                            class="flex flex-col flex-1 w-full border rounded-md border-accented"
                        >
                            <div
                                class="flex px-4 py-1 border-b border-accented"
                            >
                                <div class="font-medium text-default mt-2">
                                    Task List
                                </div>
                                <UButton
                                    class="ml-auto"
                                    label="Add Task"
                                    color="neutral"
                                    variant="outline"
                                    trailing-icon="i-lucide-list-plus"
                                    size="md"
                                    @click="openAddTaskModal"
                                />
                            </div>
                            <UTable
                                v-if="taskList"
                                ref="table"
                                class="overflow-y-auto h-48 flex-1 max-h-64"
                                :data="taskList.tasks"
                                :columns="taskColumns"
                                :ui="{
                                    tbody: 'my-table-tbody',
                                    td: 'py-1',
                                    th: 'py-1',
                                }"
                                sticky="header"
                                empty="No Tasks Assigned"
                                :get-row-id="
                                    (task: Task) => (task as any)._uiID
                                "
                            >
                                <template #action-cell="{ row }">
                                    <UTooltip
                                        text="Edit Task"
                                        ignore-non-keyboard-focus
                                    >
                                        <UButton
                                            color="neutral"
                                            variant="outline"
                                            icon="i-lucide-pencil"
                                            size="sm"
                                            @click="editTask(row.original)"
                                        />
                                    </UTooltip>
                                    <UTooltip
                                        text="Delete Task"
                                        ignore-non-keyboard-focus
                                    >
                                        <UButton
                                            color="neutral"
                                            variant="outline"
                                            icon="i-lucide-x"
                                            size="sm"
                                            @click="deleteTask(row.original)"
                                        />
                                    </UTooltip>
                                </template>
                            </UTable>
                        </div>
                    </UFormField>
                    <div class="flex flex-row gap-2">
                        <UModal
                            v-if="!creator && !alreadyPublished"
                            class="pointer-events-auto"
                            title="Publish Shift?"
                            description="This will notify relevant employees."
                            :dismissible="false"
                            :ui="{ content: `sm:max-w-xs` }"
                        >
                            <UTooltip
                                :text="
                                    state.employee
                                        ? 'Publish Shift to Employees'
                                        : 'Employee Must Be Assigned to Publish'
                                "
                                ignore-non-keyboard-focus
                            >
                                <UButton
                                    label="Publish"
                                    :disabled="!state.employee"
                                    @click="publishShift"
                                />
                            </UTooltip>
                            <template #footer="{ close }">
                                <UButton
                                    label="Publish"
                                    class="ml-auto"
                                    type="submit"
                                    @click="formElement?.submit()"
                                />
                                <UButton
                                    label="Cancel"
                                    color="neutral"
                                    variant="outline"
                                    class="mr-auto"
                                    @click="close()"
                                />
                            </template>
                        </UModal>
                        <UTooltip
                            :text="`Submit ${creator ? 'Creation' : 'Edit'}`"
                        >
                            <UButton
                                class="ml-auto"
                                type="submit"
                                :disabled="isSubmitting"
                            >
                                Submit
                            </UButton>
                        </UTooltip>
                        <UModal
                            title="Delete shift?"
                            description="Deletion can not be undone."
                            :dismissible="false"
                            :ui="{ content: 'sm:max-w-xs' }"
                        >
                            <UTooltip text="Delete Shift">
                                <UButton
                                    label="Delete"
                                    color="neutral"
                                    variant="outline"
                                    :disabled="isSubmitting"
                                />
                            </UTooltip>

                            <template #footer="{ close }">
                                <UButton
                                    label="Delete"
                                    class="ml-auto"
                                    @click="deleteEvent()"
                                />
                                <UButton
                                    label="Cancel"
                                    color="neutral"
                                    variant="outline"
                                    class="mr-auto"
                                    @click="close()"
                                />
                            </template>
                        </UModal>
                        <UTooltip
                            :text="`Cancel ${creator ? 'Creation' : 'Edit'}`"
                        >
                            <UButton
                                label="Cancel"
                                variant="outline"
                                color="neutral"
                                :disabled="isSubmitting"
                                @click="cancelEventEdit()"
                                ignore-non-keyboard-focus
                            />
                            <UModal
                                title="Discard unsaved changes?"
                                description="Discarded changes can not be undone."
                                :dismissable="false"
                                :ui="{ content: 'sm:max-w-xs' }"
                                :open="isCancelModalOpen"
                            >
                                <template #footer>
                                    <UButton
                                        label="Discard"
                                        @click="toggleModal()"
                                    />
                                    <UButton
                                        label="Cancel"
                                        variant="outline"
                                        color="neutral"
                                        @click="isCancelModalOpen = false"
                                    />
                                </template>
                            </UModal>
                        </UTooltip>
                    </div>
                </UForm>
            </div>
            <TaskEditor
                ref="table"
                v-model="editedTask"
                :is-open="isTaskEditorOpen"
                :creator="isCreatingTask"
                @close-requested="closeTaskModal()"
                @add-requested="onTaskAddRequested()"
                @remove-checks="removeCheckOffs"
            />
        </template>
    </UModal>
</template>
