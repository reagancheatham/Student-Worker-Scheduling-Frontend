<script setup lang="ts">
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { useTemplateRef } from "vue";

const table = useTemplateRef("table");
const globalFilter = ref("");

//create class
type Employee = {
    Id: number;
    Name: String;
    Email: String;
    Role: "Manager" | "Barista" | "Register"; // will need to be set by manager
};

//TODO: NEED TO IMPLEMENT INFINITE SCROLL WHEN WE START GETTING DATA FROM BACKEND

const data = ref<Employee[]>([
    {
        Id: 1588221,
        Name: "David Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1668221,
        Name: "Roger Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1583321,
        Name: "John Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1587721,
        Name: "Bob Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1588221,
        Name: "David Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1668221,
        Name: "Roger Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1583321,
        Name: "John Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1587721,
        Name: "Bob Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1588221,
        Name: "David Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1668221,
        Name: "Roger Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1583321,
        Name: "John Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1587721,
        Name: "Bob Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1588221,
        Name: "David Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1668221,
        Name: "Roger Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1583321,
        Name: "John Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1587721,
        Name: "Bob Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1588221,
        Name: "David Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1668221,
        Name: "Roger Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1583321,
        Name: "John Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
    {
        Id: 1587721,
        Name: "Bob Clonts",
        Email: "David.Clonts@eagles.oc.edu",
        Role: "Manager",
    },
]);

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
