<script setup lang="ts">
import { ref } from "vue";
import { Employee } from "@classes/database/employee";
import { EmployeeServices } from "../services/employeeServices";
import { TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import { useClipboard } from "@vueuse/core";
import { Row } from "@tanstack/vue-table";
import { Store } from "@classes/util/store.ts";

const globalFilter = ref();
const toast = useToast();
const { copy } = useClipboard();
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const deleteDoubleConfirm = ref(false); //ask rag for better ways to handle the double confirm modal???
const selectedEmployee = ref(<Employee | null>null);

let data = ref<Employee[]>([]);

// "Nonsensical" be warned
const columns: TableColumn<Employee>[] = [
    {
        accessorKey: "studentID",
        header: "Id",
        cell: ({ row }) => `${row.getValue("studentID")}`,
    },
    {
        id: "name",
        header: "Name",
        cell: ({ row }) => row.original.fullName,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => `${row.getValue("email")}`,
    },
    {
        accessorKey: "phoneNumber",
        header: "Phone Number",
        cell: ({ row }) => row.original.formattedPhoneNumber,
    },
    {
        id: "actions",
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
                    items: getRowItems(row),
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

function getRowItems(row: Row<Employee>) {
    return [
        [
            {
                label: "Copy Student ID",
                icon: "i-lucide-copy",
                onSelect() {
                    copy(row.original.studentID);

                    toast.add({
                        title: "Employee ID copied to clipboard!",
                        color: "success",
                        icon: "i-lucide-circle-check",
                    });
                },
            },
            {
                label: "Copy Email",
                icon: "i-lucide-copy",
                onSelect() {
                    copy(row.original.email);

                    toast.add({
                        title: "Employee Email copied to clipboard!",
                        color: "success",
                        icon: "i-lucide-circle-check",
                    });
                },
            },
        ],
        [
            {
                label: "Delete",
                icon: "i-lucide-trash",
                color: "error",
                onSelect() {
                    openDoubleConfirm(row.original);
                },
            },
        ],
    ];
}

function openDoubleConfirm(employee: Employee) {
    deleteDoubleConfirm.value = true;
    selectedEmployee.value = employee;
}

function deleteEmployee() {
    EmployeeServices.delete(selectedEmployee.value);
    deleteDoubleConfirm.value = false;

    //chatGPT table update solution
    data.value = data.value.filter(
        e => e.studentID !== selectedEmployee.value!.studentID
    );
}

EmployeeServices.getAllForBusiness(Store.getBusiness().id)
    .then((result) => {
        data.value = result;
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });
</script>

<template>
    <!-- TODO: figure out how to get an x instead of arrow -->
    <UModal v-model:open="deleteDoubleConfirm" title="Are you sure?" close-icon="i-lucide-arrow-right">
        <template #body>
            <div class="text-center text-2xl font-medium">
                Are you sure you want to delete 
                <br>
                {{ selectedEmployee.fullName }}?
            </div>
            <div class="flex justify-center gap-4 pt-4">
                <UButton label="Yes" color="primary" @click="deleteEmployee()"/>
                <UButton label="No" color="neutral" variant="outline" @click="deleteDoubleConfirm = false" />
            </div>
        </template>
    </UModal>

    <div class="h-screen flex flex-col">
        <div class="flex justify-between px-4 py-3.5 border-b border-accented">
            <UInput
                v-model="globalFilter"
                class="max-w-sm"
                placeholder="Filter..."
            />

            <UButton label="Add Employee" color="primary" />
        </div>
        <UTable
            class="flex-1"
            :columns="columns"
            :data="data"
            ref="table"
            v-model:global-filter="globalFilter"
        >
            <template #name-cell="{ row }">
                <div class="flex items-c>enter gap-3">
                    <UAvatar />
                    <div>
                        <p class="font-medium">
                            {{ row.original.fullName }}
                        </p>
                    </div>
                </div>
            </template>
        </UTable>
    </div>
</template>
