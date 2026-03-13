<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ref, onMounted } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import { ShiftServices } from "../../services/shiftServices.ts";

const UBadge = resolveComponent("UBadge");

type OpenShiftRow = {
    ShiftSlot: string;
    Reason: "Unscheduled";
}
type OpenShiftRow = {
    ShiftSlot: string;
    Reason: "Unscheduled";
}

const { title } = defineProps<{
    title: string;
}>();

const data = ref<OpenShiftRow[]>([]);

function formatShiftSlot(start: Date, end: Date): string {
    const dateStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const startTime = start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    const endTime = end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
    return `${dateStr}, ${startTime} - ${endTime}`;
}

onMounted(async () => {
    const now = new Date();
    const future = new Date(now);
    future.setDate(future.getDate() + 30);

    const shifts = await ShiftServices.getAllInRange(1, now, future);
    data.value = shifts
        .filter((shift) => !shift.employee)
        .map((shift) => ({
            ShiftSlot: formatShiftSlot(new Date(shift.startTime), new Date(shift.endTime)),
            Reason: "Unscheduled",
        }));
});

const columns: TableColumn<OpenShiftRow>[] = [
const columns: TableColumn<OpenShiftRow>[] = [
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
                Unscheduled: "neutral" as const,
            }[row.getValue("Reason") as string];

            //no idea what h is
            return h(
                UBadge,
                { class: "capitalize", variant: "subtle", color },
                () => row.getValue("Reason"),
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
            :ui="{
                thead: 'hidden',
            }"
        ></UTable>
    </UCard>
</template>
