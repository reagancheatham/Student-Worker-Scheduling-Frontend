<script setup lang="ts">
import { Store } from "@classes/util/store/store.ts";
import { h, onMounted, ref, resolveComponent } from "vue";
import { TableColumn } from "@nuxt/ui";
import * as v from "valibot";
import { TempStore } from "@classes/util/store/tempStore.ts";
import { Business } from "@classes/database/business.ts";
import { Row } from "@tanstack/vue-table";
import { TaskListTemplate } from "@classes/database/taskListTemplate.ts";
import { TaskListTemplateServices } from "../../services/taskListTemplateServices.ts";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const globalFilter = ref();
const isModalOpen = ref(false);
const isCreatingList = ref(false);
const editedList = ref<TaskListTemplate>();
const lists = ref<TaskListTemplate[]>([]);

let business: Business;

const columns: TableColumn<TaskListTemplate>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorFn: (row) => row.tasks.length,
        header: "Task Count",
    },
    {
        id: "action",
        meta: {
            class: {
                td: "text-right",
            },
        },
        cell: ({ row }) => {
            return h(
                UDropdownMenu,
                {
                    content: {
                        align: "end",
                    },
                    items: getActionItems(row),
                },
                () =>
                    h(UButton, {
                        icon: "i-lucide-ellipsis-vertical",
                        color: "neutral",
                        variant: "ghost",
                    }),
            );
        },
    },
];

onMounted(async () => {
    updateLists();
});

async function updateLists(): Promise<void> {
    const storeBusiness = await Store.businessStore.get();

    if (!storeBusiness) return;

    business = storeBusiness;

    try {
        lists.value = await TaskListTemplateServices.getAllForBusiness(
            business.id,
        );
    } catch (error: any) {
        console.error(`Error getting roles: ${error}`);
    }

    editedList.value = createDefaultTaskList();
}

function getActionItems(row: Row<TaskListTemplate>) {
    return [
        [
            {
                label: "Edit",
                icon: "i-lucide-pencil",
                onSelect: () => openEditModal(row.original),
            },
        ],
        [
            {
                label: "Delete",
                icon: "i-lucide-trash",
                color: "error",
                onSelect: () => deleteTaskList(row.original),
            },
        ],
    ];
}

function openAddModal(): void {
    isCreatingList.value = true;
    editedList.value = createDefaultTaskList();
    isModalOpen.value = true;
}

function openEditModal(list: TaskListTemplate): void {
    isCreatingList.value = false;
    editedList.value = list;

    isModalOpen.value = true;
}

function closeEditModal(): void {
    isModalOpen.value = false;
}

function createDefaultTaskList(): TaskListTemplate {
    return new TaskListTemplate(0, business.id, "New Task List", []);
}

async function deleteTaskList(list: TaskListTemplate): Promise<void> {
    TempStore.isLoading = true;

    await TaskListTemplateServices.delete(list);

    const index = lists.value.indexOf(list);

    if (index !== -1) lists.value.splice(index, 1);

    TempStore.isLoading = false;
}
</script>

<template>
    <div class="w-full self-center justify-self-center">
        <div
            class="flex justify-between px-4 py-3.5 border-b border-accented gap-4"
        >
            <UInput
                v-model="globalFilter"
                class="max-w-sm"
                placeholder="Filter..."
            />

            <UButton
                label="Add Task List"
                color="primary"
                @click="openAddModal()"
            />
        </div>
        <UTable
            :columns="columns"
            :data="lists"
            ref="table"
            v-model:global-filter="globalFilter"
        />
    </div>
    <TemplateTaskListEditor
        v-if="editedList"
        v-model="editedList"
        :creator="isCreatingList"
        :is-open="isModalOpen"
        @close-requested="closeEditModal()"
        @form-submitted="updateLists()"
    />
</template>
