<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { h, resolveComponent } from "vue";
import { ShiftServices } from "../../services/shiftServices.ts";
import { Store } from "@classes/util/store/store.ts";
import { Shift } from "@classes/database/shift.ts";

const UBadge = resolveComponent("UBadge");

const shifts = ref<Shift[]>([]);

const columns: TableColumn<Shift>[] = [
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        header: "Shift",
        cell: ({ row }) => {
            return `${row.original.startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} - ${row.original.endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        },
    },
];

onMounted(async () => {
    const business = await Store.businessStore.get();

    if (!business) return;

    const beginningOfDay = new Date();
    const endOfDay = new Date();
    beginningOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(24, 0, 0, 0);

    shifts.value = await ShiftServices.getAllInRangeForBusiness(
        business.id,
        beginningOfDay,
        endOfDay,
    );
});
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
            <span class="mb"> Working Currently </span>
        </template>
        <UTable
            :data="shifts"
            :columns="columns"
            :ui="{
                thead: 'hidden',
            }"
        ></UTable>
    </UCard>
</template>
