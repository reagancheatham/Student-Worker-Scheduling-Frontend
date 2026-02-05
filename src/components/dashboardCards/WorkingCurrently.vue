<script setup lang="ts">
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";

const UBadge = resolveComponent("UBadge");

type ShiftInfo = {
  Name: String;
  Shift: String; //string for now
  Status: "Late" | "On Time" | "Upcoming";
};

const data = ref<ShiftInfo[]>([
  {
    Name: "David Clonts",
    Shift: "10:30a.m. - 2:30p.m.",
    Status: "Late",
  },
  {
    Name: "David Clonts II",
    Shift: "10:30a.m. - 2:30p.m.",
    Status: "Late",
  },
  {
    Name: "Reagan Cheatham",
    Shift: "10:30a.m. - 2:30p.m.",
    Status: "On Time",
  },
  {
    Name: "Reagan Cheathamyie",
    Shift: "10:30a.m. - 2:30p.m.",
    Status: "On Time",
  },
  {
    Name: "David Clonts",
    Shift: "1:30a.m. - 4:30p.m.",
    Status: "Upcoming",
  },
]);

const columns: TableColumn<ShiftInfo>[] = [
  {
    accessorKey: "Name",
    header: "Name",
    cell: ({ row }) => {
      return `${row.getValue("Name")}`;
    },
  },
  {
    accessorKey: "Shift",
    header: "Shift",
    cell: ({ row }) => {
      return `${row.getValue("Shift")}`;
    },
  },
  {
    accessorKey: "Status",
    header: "Status",
    cell: ({ row }) => {
      const color = {
        Late: "error" as const,
        "On Time": "success" as const, //rag might not like this
        Upcoming: "neutral" as const,
      }[row.getValue("Status") as string];

      //no idea what h is
      return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
        row.getValue("Status"),
      );
    },
  },
];
</script>

<template>
  <UCard
    class="h-full min-h-0 flex flex-col"
    :ui="{
      header: 'font-semibold text-black shrink-0',
      body: '!px-0 !pt-0 !pb-3 flex-1 overflow-y-auto min-h-0',
    }"
  >
    <template #header>
      <span class="mb"> Working Currently </span>
    </template>
    <UTable 
      :data="data" 
      :columns="columns"
      :ui="{
        thead: 'hidden'
      }"
    ></UTable>
  </UCard>
</template>
