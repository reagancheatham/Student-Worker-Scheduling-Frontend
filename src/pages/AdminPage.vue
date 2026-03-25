<script setup lang="ts">
import { ref, h, resolveComponent, useTemplateRef, computed } from "vue";
import type { Row } from "@tanstack/vue-table";
import { BusinessServices } from "../services/businessService";
import { Business } from "@classes/database/business";
import { Employee } from "@classes/database/employee";

const UButton = resolveComponent("UButton");
const UBadge = resolveComponent("UBadge");
const UDropdownMenu = resolveComponent("UDropdownMenu");

let data = ref<Business[]>([]);

const columns = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorFn: (row: { owner: { fullName: any; }; }) => row.owner?.fullName ?? "",
    header: "Owner Name",
    cell: ({ row }: { row: Row<Business> }) => {
      const business = row.original;
      return business.owner.fullName;
    },
  },
  {
    accessorFn: (row: { owner: { phoneNumber: any; }; }) => row.owner?.phoneNumber ?? "",
    header: "Owner Phone Number",
    cell: ({ row }: { row: Row<Business> }) => {
      const business = row.original;
      return business.owner.phoneNumber;
    },
  },
  {
    accessorFn: (row: { owner: { email: any; }; }) => row.owner?.email ?? "",
    header: "Owner Name",
    cell: ({ row }: { row: Row<Business> }) => {
      const business = row.original;
      return business.owner.email;
    },
  },
  {
    id: "actions",
    meta: {
      class: {
        td: "text-right",
      },
    },
    cell: ({ row }: { row: Row<Business> }) => {
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

function getRowItems(row: Row<Business>) {
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

BusinessServices.getAll()
  .then((result) => {
    data.value = result;
    console.log(data);
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
