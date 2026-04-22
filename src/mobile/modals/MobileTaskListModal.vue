<script setup lang="ts">
import { Task } from "@classes/database/task";
import { TaskList } from "@classes/database/taskList";
import { Store } from "@classes/util/store/store";
import { TableColumn, TableRow } from "@nuxt/ui";
import { ref } from "node:process";
import { h, resolveComponent } from "vue";
import { EmployeeServices } from "../../services/employeeServices";
import { TaskCheckOff } from "@classes/database/taskCheckOff";

defineProps<{
    taskList: TaskList;
}>();

const model = defineModel<Task>({
    required: true,
});

let removedCheckOffs: TaskCheckOff[] = [];

const UCheckbox = resolveComponent("UCheckbox");

const columns: TableColumn<Task>[] = [
    {
        header: "Task",
        accessorKey: "name",
    },
    {
        header: "Check Off",
        id: "checkbox",
        cell: ({ row }) => {
            return h(UCheckbox, {
                modelValue: row.getIsSelected(),
                "onUpdate:modelValue": (val: boolean | "indeterminate") => {

                    row.toggleSelected(!!val);
                },
            });
        },
    },
];

async function checkOff(): Promise<void> {
    const user = await Store.userStore.get();
    const business = await Store.businessStore.get();

    if (!user || !business) {
        console.error("User or business is invalid!");
        return;
    }

    const employee = await EmployeeServices.getEmployeeForUserAndBusiness(
        user,
        business,
    );

    if (employee)
        model.value.checkOffs.push(
            new TaskCheckOff(0, model.value.id, employee),
        );
    else console.error("Could not find employee for user and business!");
}

async function removeCheckOff(): Promise<void> {
    const user = await Store.userStore.get();
    const business = await Store.businessStore.get();

    if (!user || !business) {
        console.error("User or business is invalid!");
        return;
    }

    const employee = await EmployeeServices.getEmployeeForUserAndBusiness(
        user,
        business,
    );

    if (employee) {
        const index = model.value.checkOffs.findIndex(
            (c) => c.employee.id === employee.id,
        );

        if (index !== -1) {
            let checkOff = model.value.checkOffs.splice(index, 1)[0];
            removedCheckOffs.push(checkOff);
        }
    } else console.error("Could not find employee for user and business!");
}
</script>

<template>
    <UModal title="Task List">
        <template #body>
            <UTable :data="taskList.tasks" :columns="columns"> </UTable>
        </template>
    </UModal>
</template>
