<script setup lang="ts">
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { useTemplateRef } from "vue";
import { Employee } from "@classes/Employee";
import { EmployeeServices } from "../services/employeeServices";

const table = useTemplateRef("table");
const globalFilter = ref("");

let data: Employee[];

EmployeeServices.getAllForBusiness(1)
    .then((result) => {
        data = result;
        console.log(data);
    }).catch((err) => {
        console.error(err);
    });

//TODO: NEED TO IMPLEMENT INFINITE SCROLL WHEN WE START GETTING DATA FROM BACKEND

const columns: TableColumn<Employee>[] = [
    {
        accessorKey: "Id",
        header: "Id",
        cell: ({ row }) => {
            return `${row.getValue("Id")}`;
        },
    },
    {
        accessorKey: "Name",
        header: "Name",
        cell: ({ row }) => {
            return `${row.getValue("Name")}`;
        },
    },
    {
        accessorKey: "Role",
        header: "Role",
        cell: ({ row }) => {
            return `${row.getValue("Role")}`;
        },
    },
    {
        accessorKey: "Email",
        header: "Email",
        cell: ({ row }) => {
            return `${row.getValue("Email")}`;
        },
    },
];
</script>

<template>
    <div class="h-screen flex flex-col">
        <UTable
            class="flex-1"
            :data="data"
            :columns="columns"
            ref="table"
        />
    </div>
</template>
