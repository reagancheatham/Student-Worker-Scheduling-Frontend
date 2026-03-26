<script setup lang="ts">
import { ref, h, resolveComponent, useTemplateRef, computed } from "vue";
import type { Row } from "@tanstack/vue-table";
import { Business } from "@classes/database/business";
import { Employee } from "@classes/database/employee";
import { EmployeeServices } from "../services/employeeServices";
import { BusinessServices } from "../services/businessService";

const UButton = resolveComponent("UButton");
const UDropdownMenu = resolveComponent("UDropdownMenu");

type BusinessRow = {
    id: number;
    name: string;
    ownerName: string;
    ownerPhoneNumber: string;
    ownerEmail: string;
};
let data = ref<BusinessRow[]>([]);

const columns = [
    {
        accessorKey: "id",
        header: "ID",
        meta: { class: "w-[20%] whitespace-normal" },
    },
    {
        accessorKey: "name",
        header: "Name",
        meta: { style: "w-[60%] whitespace-normal" },
    },
    {
        accessorKey: "ownerName",
        header: "Owner Name",
        width: "5%",
    },
    {
        accessorKey: "ownerPhoneNumber",
        header: "Owner Phone Number",
        width: "5%",
    },
    {
        accessorKey: "ownerEmail",
        header: "Owner Email",
        width: "5%",
    },
    {
        id: "actions",
        width: "5%",
        meta: {
            class: {
                td: "text-right",
            },
        },
        cell: ({ row }: { row: Row<BusinessRow> }) => {
            return h(
                UDropdownMenu,
                {
                    content: {
                        align: "end",
                    },
                    items: getRowItems(row),
                    "aria-label": "Actions dropdown",
                },
                () =>
                    h(UButton, {
                        icon: "i-lucide-ellipsis-vertical",
                        color: "neutral",
                        variant: "ghost",
                        "aria-label": "Actions dropdown",
                    }),
            );
        },
    },
];

function getRowItems(row: Row<BusinessRow>) {
    return [
        {
            type: "label",
            label: "Actions",
        },
        {
            label: "Edit Business",
            onSelect() {},
        },
        {
            label: "Delete Business",
            onSelect() {},
        },
    ];
}

EmployeeServices.getAllOwners()
    .then((owners: any[]) => {
        const rows = owners.map((owner) => {
            const ownerEmployee = new Employee(
                owner.id,
                owner.User.studentID,
                owner.User.firstName,
                owner.User.lastName,
                owner.User.email,
                owner.User.phoneNumber,
            );

            return {
                id: owner.Business.id,
                name: owner.Business.name,
                ownerName: ownerEmployee.fullName,
                ownerPhoneNumber: ownerEmployee.formattedPhoneNumber,
                ownerEmail: ownerEmployee.email,
            };
        });

        data.value = rows;
    })
    .catch((err) => {
        console.error(err);
    });

const globalFilter = ref("");
</script>

<template>
    <UDashboardPanel>
        <template #header>
            <ScheduleNavbar />
        </template>

        <template #body class="overflow-hidden!">
            <div class="h-screen flex flex-col">
                <UInput
                    v-model="globalFilter"
                    class="max-w-sm"
                    placeholder="Search all columns..."
                />

                <UTable
                    sticky
                    class="flex-1"
                    v-model:global-filter="globalFilter"
                    :data="data"
                    ref="table"
                    :columns="columns"
                />
            </div>
        </template>
    </UDashboardPanel>
</template>
