<script setup lang="ts">
import { TaskListTemplate } from "@classes/database/taskListTemplate.ts";
import { TaskTemplate } from "@classes/database/taskTemplate.ts";
import { UIIDUtil } from "@classes/util/uiIDUtil.ts";
import { onMounted, reactive, ref, watch, useTemplateRef } from "vue";
import * as v from "valibot";
import { FormSubmitEvent } from "@nuxt/ui";
import { TaskTemplateServices } from "../../../services/taskTemplateServices.ts";
import {
    useSortable,
    UseSortableReturn,
} from "@vueuse/integrations/useSortable";

const model = defineModel<TaskListTemplate>({
    required: true,
});

const { isOpen, creator } = defineProps<{
    isOpen: boolean;
    creator: boolean;
}>();

const emit = defineEmits({
    closeRequested: () => true,
    formSubmitted: () => true,
});

const schema = v.pipe(
    v.object({
        name: v.pipe(v.string(), v.nonEmpty("Name is required")),
        tasks: v.pipe(v.array(v.instance(TaskTemplate)), v.nonEmpty()),
    }),
);
type Schema = v.InferOutput<typeof schema>;

const state = reactive<{
    name: string;
    tasks: TaskTemplate[];
}>({
    name: model.value.name,
    tasks: model.value.tasks,
});

const tableElement = useTemplateRef("table");
const isCreatingTask = ref(false);
const isModalOpen = ref(false);
const isCancelModalOpen = ref(false);
const isDirty = ref(false);
const editedTask = ref<TaskTemplate>(createDefaultTask());

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
        id: "action",
        header: "Action",
    },
];

let deletedTasks: TaskTemplate[] = [];
let sortableInstance: UseSortableReturn;

onMounted(() => {
    watch(() => isOpen, initializeState);

    if (isOpen) initializeState();

    watch(tableElement, (element) => {
        if (element && isOpen) {
            if (!(element.$el instanceof HTMLElement)) return;

            const el = element.$el as HTMLElement;
            if (sortableInstance) sortableInstance.stop();

            sortableInstance = useSortable(
                el.querySelector("tbody"),
                state.tasks,
                {
                    animation: 150,
                    onUpdate: (e: any) => {
                        const tasks = state.tasks;
                        const movedItem = tasks.splice(e.oldIndex, 1)[0];

                        tasks.splice(e.newIndex, 0, movedItem);

                        // force Vue to redraw
                        state.tasks = [...tasks];
                    },
                } as any,
            );
        }
    });
});

function initializeState(): void {
    if (!isOpen) return;

    state.name = model.value.name;
    state.tasks = [...model.value.tasks];
    isDirty.value = false;

    initializeTaskUIIDs();
}

function initializeTaskUIIDs() {
    state.tasks.forEach((task) => {
        if (!(task as any)._uiID) UIIDUtil.attachUUID(task, "task");
    });
}

function openAddTaskModal(): void {
    isCreatingTask.value = true;
    editedTask.value = createDefaultTask();
    isModalOpen.value = true;
}

function onTaskAddRequested(): void {
    UIIDUtil.attachUUID(editedTask.value, "task");

    editedTask.value.listOrder = state.tasks.length;
    state.tasks.push(editedTask.value);
    editedTask.value = createDefaultTask();
    isDirty.value = true;
}

function editTask(task: TaskTemplate): void {
    editedTask.value = task;
    isCreatingTask.value = false;
    isModalOpen.value = true;

    isDirty.value = true;
}

function deleteTask(task: TaskTemplate): void {
    deletedTasks.push(task);
    const tasks = state.tasks;
    tasks.splice(tasks.indexOf(task), 1);

    isDirty.value = true;
}

function closeTaskModal(): void {
    isModalOpen.value = false;
}

function createDefaultTask(): TaskTemplate {
    return new TaskTemplate(0, model.value.id, 0, "New Task", "");
}

async function submitModalForm(_: FormSubmitEvent<Schema>): Promise<void> {
    model.value.name = state.name;
    model.value.tasks = state.tasks;

    emit("closeRequested");

    const taskPromises = deletedTasks.map(async (task) => {
        if (task.isValid()) return await TaskTemplateServices.delete(task);
    });

    await Promise.all(taskPromises);
    await model.value.updateBackend();
    emit("formSubmitted");
}

function cancelEdit(): void {
    if (isDirty.value && !isCancelModalOpen.value) {
        isCancelModalOpen.value = true;
        return;
    }

    isCancelModalOpen.value = false;
    emit("closeRequested");
}
</script>

<template>
    <UModal :open="isOpen">
        <template #content>
            <div class="p-2 flex flex-row">
                <p class="text-xl font-semibold ml-2">
                    {{ creator ? "Task List Creator" : "Task List Editor" }}
                </p>
            </div>
            <UForm class="flex flex-col gap-4 p-4" @submit="submitModalForm">
                <UFormField label="Name" name="name">
                    <UInput v-model="state.name" placeholder="Enter Name" />
                </UFormField>
                <UFormField name="tasks">
                    <div
                        class="flex flex-col flex-1 w-full border rounded-md border-accented"
                    >
                        <div class="flex px-4 py-1 border-b border-accented">
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
                                @click="openAddTaskModal()"
                            />
                        </div>
                        <UTable
                            ref="table"
                            class="overflow-y-auto h-48 flex-1 max-h-64"
                            :data="state.tasks"
                            :columns="taskColumns"
                            :ui="{
                                tbody: 'my-table-tbody',
                                td: 'py-1',
                                th: 'py-1',
                            }"
                            sticky="header"
                            empty="No Tasks Assigned"
                            :get-row-id="
                                (task: TaskTemplate) => (task as any)._uiID
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
                <div class="flex w-full">
                    <UButton
                        class="ml-auto"
                        label="Submit"
                        :disabled="state.tasks.length === 0"
                        type="submit"
                    />
                    <UButton
                        label="Cancel"
                        color="neutral"
                        variant="outline"
                        @click="cancelEdit"
                    />
                    <UModal
                        title="Discard unsaved changes?"
                        description="Discarded changes can not be undone."
                        :dismissable="false"
                        :ui="{ content: 'sm:max-w-xs' }"
                        :open="isCancelModalOpen"
                    >
                        <template #footer>
                            <UButton label="Discard" @click="cancelEdit()" />
                            <UButton
                                label="Cancel"
                                variant="outline"
                                color="neutral"
                                @click="isCancelModalOpen = false"
                            />
                        </template>
                    </UModal>
                </div>
                <TemplateTaskEditor
                    v-model="editedTask"
                    :is-open="isModalOpen"
                    :creator="isCreatingTask"
                    @close-requested="closeTaskModal()"
                    @add-requested="onTaskAddRequested()"
                />
            </UForm>
        </template>
    </UModal>
</template>
