
<script setup lang="ts">
import { Task } from "@classes/database/task";
import { TaskList } from "@classes/database/taskList";
import { Store } from "@classes/util/store/store";
import { TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import { EmployeeServices } from "../../services/employeeServices";
import { TaskCheckOff } from "@classes/database/taskCheckOff";
import { TaskServices } from "../../services/taskServices";

defineProps<{
    taskList: TaskList;
}>();

let newCheckOffs: TaskCheckOff[] = [];
let removedCheckOffs: TaskCheckOff[] = [];

const UCheckbox = resolveComponent("UCheckbox");

// cache employee
let currentEmployeeId: number | null = null;

async function getEmployeeId(): Promise<number | null> {
    if (currentEmployeeId) return currentEmployeeId;

    const user = await Store.userStore.get();
    const business = await Store.businessStore.get();

    if (!user || !business) {
        console.error("User or business is invalid!");
        return null;
    }

    const employee = await EmployeeServices.getEmployeeForUserAndBusiness(
        user,
        business,
    );

    if (!employee) {
        console.error("Could not find employee!");
        return null;
    }

    currentEmployeeId = employee.id;
    return employee.id;
}

const columns: TableColumn<Task>[] = [
    {
        header: "Task",
        accessorKey: "name",
    },
    {
        header: "Check Off",
        id: "checkbox",
        cell: ({ row }) => {
            const task = row.original;

            const isChecked = task.checkOffs.some(
                (c) => c.employee.id === currentEmployeeId
            );

            return h(UCheckbox, {
                modelValue: isChecked,

                "onUpdate:modelValue": async (val: boolean | "indeterminate") => {
                    const employeeId = await getEmployeeId();
                    if (!employeeId) return;

                    const checked = val === true;

                    if (checked) {
                        checkOff(task, employeeId);
                    } else {
                        removeCheckOff(task, employeeId);
                    }
                },
            });
        },
    },
];

function checkOff(task: Task, employeeId: number) {
    const check = new TaskCheckOff(0, task.id, { id: employeeId } as any);

    task.checkOffs.push(check);
    newCheckOffs.push(check);
}

function removeCheckOff(task: Task, employeeId: number) {
    const index = task.checkOffs.findIndex(
        (c) => c.employee.id === employeeId,
    );

    if (index !== -1) {
        const checkOff = task.checkOffs.splice(index, 1)[0];

        // If it was newly created, cancel it
        const newIndex = newCheckOffs.indexOf(checkOff);
        if (newIndex !== -1) {
            newCheckOffs.splice(newIndex, 1);
        } else {
            removedCheckOffs.push(checkOff);
        }
    }
}

async function syncCheckOffs() {
    try {
        // create new
        await Promise.all(
            newCheckOffs.map((c) =>
                TaskServices.createCheckOff(c)
            )
        );

        // delete removed
        await Promise.all(
            removedCheckOffs.map((c) =>
                TaskServices.deleteCheckOff(c)
            )
        );

        newCheckOffs = [];
        removedCheckOffs = [];
    } catch (err) {
        console.error("Failed to sync check-offs:", err);
    }
}

async function onClose() {
    await syncCheckOffs();
}
</script>

<template>
    <UModal title="Task List" @close="onClose">
        <template #body>
            <UTable :data="taskList.tasks" :columns="columns" />
        </template>
    </UModal>
</template>
