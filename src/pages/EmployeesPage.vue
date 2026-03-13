<script setup lang="ts">
import { ref } from "vue";
import { Employee } from "@classes/database/employee";
import { EmployeeServices } from "../services/employeeServices";
import { TableColumn } from "@nuxt/ui";

let data = ref<Employee[]>([]);

const columns: TableColumn<Employee>[] = [
    {
        accessorKey: 'studentID',
        header: 'Id',
        cell: ({ row }) => `#${row.getValue('studentID')}`
    }
]

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
    <div class="h-screen flex flex-col">
        <UTable class="flex-1" :columns="columns" :data="data" ref="table" />
    </div>
</template>
