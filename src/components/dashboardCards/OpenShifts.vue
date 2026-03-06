<script setup lang="ts">
import { ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";

const UBadge = resolveComponent("UBadge");

//create class for these eventually
type OpenShifts = {
    ShiftSlot: String;
    Reason: "Dropped" | "Unscheduled";
}

const { title } = defineProps<{
    title: string
}>();

const data = ref<OpenShifts[]>([
    {
        ShiftSlot: "Feb. 16, 10:30a.m. - 1:30p.m.",
        Reason: "Dropped"
    },
    {
        ShiftSlot: "Feb. 22, 10:30a.m. - 1:30p.m.",
        Reason: "Unscheduled"
    },
    {
        ShiftSlot: "Feb. 23, 10:30a.m. - 1:30p.m.",
        Reason: "Unscheduled"
    },
    {
        ShiftSlot: "Feb. 24, 10:30a.m. - 11:30p.m.",
        Reason: "Unscheduled"
    },
]);

const columns: TableColumn<OpenShifts>[] = [
    {
        accessorKey: "ShiftSlot",
        header: "Shift",
        cell: ({ row }) => {
            return `${row.getValue("ShiftSlot")}`;
        },
    },
    {
        accessorKey: "Reason",
        header: "Reason",
        cell: ({ row }) => {
            const color = {
                Dropped: "error" as const,
                Unscheduled: "neutral" as const,
            }[row.getValue("Reason") as string];

            //no idea what h is
            return h(UBadge, { class: "capitalize", variant: "subtle", color }, () =>
                row.getValue("Reason"),
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
      body: 'px-0! pt-0! pb-3! flex-1 overflow-y-auto min-h-0',
    }"
  >
    <template #header>
      <span class="mb"> {{ title }} </span>
    </template>
    <UTable 
        :columns="columns" 
        :data="data" 
        :ui = "{
            thead: 'hidden',
        }"
    ></UTable>
  </UCard>
</template>