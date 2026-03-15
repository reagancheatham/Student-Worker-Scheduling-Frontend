<script setup lang="ts">
import { ref } from "vue";
import { Employee } from "@classes/database/employee";
import { EmployeeServices } from "../services/employeeServices";
import { TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import { useClipboard } from "@vueuse/core";
import { Row } from "@tanstack/vue-table";
import { f } from "vue-router/dist/router-CWoNjPRp.mjs";

const globalFilter = ref();
const toast = useToast();
const { copy } = useClipboard();
const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

const isOpen = ref(false); //ask rag for better ways to handle the double confirm modal???

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
                    })
                },
            },
        ],
        [
            {
                label: "Copy Email",
                icon: "i-lucide-copy",
                onselect() {
                    copy(row.original.email);
    
                    toast.add({
                        title: "Employee Email copied to clipboard!",
                        color: "success",
                        icon: "i-lucide-circle-check",
                    })
                },
            },
        ],
        [
            {
                type: "separator",
            },
            {
                label: "Delete",
                icon: "i-lucide-trash",
                color: "error",
                onselect() {
                    console.log("made it");
                },
            },
        ]
    ];
}

EmployeeServices.getAllForBusiness(1)
    .then((result) => {
        data.value = result;
        console.log(data);
    })
    .catch((err) => {
        console.error(err);
    });
</script>

<template>
    <!-- <UModal v-model="isOpen">
        <UCard>
            <template #header>
                <h3 class="text-lg font-semibold">Confirm Deletion</h3>
            </template>
        </UCard>
    </UModal> -->

    <div class="h-screen flex flex-col">
        <div class="flex px-4 py-3.5 border-b border-accented">
            <UInput
                v-model="globalFilter"
                class="max-w-sm"
                placeholder="Filter..."
            />
        </div>
        <UTable
            class="flex-1"
            :columns="columns"
            :data="data"
            ref="table"
            v-model:global-filter="globalFilter"
        >
            <template #name-cell="{ row }">
                <div class="flex items-center gap-3">
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
