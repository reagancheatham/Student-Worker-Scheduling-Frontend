<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { ShiftTradeRequestServices } from "../../services/shiftTradeRequestServices.ts";
import { ShiftTradeRequest } from "@classes/database/shiftTradeRequest.ts";
import { Store } from "@classes/util/store/store.ts";
import { TimeFormatter } from "@classes/util/timeFormat.ts";
import { ShiftOfferRequestServices } from "../../services/shiftOfferRequestServices.ts";
import { ShiftOfferRequest } from "@classes/database/shiftOfferRequest.ts";

const toast = useToast();

const openShifts = ref<ShiftOfferRequest[]>([]);
const tradeRequests = ref<ShiftTradeRequest[]>([]);

type OpenShiftRow = {
    offer: ShiftOfferRequest;
    date: string;
    shiftStart: string;
    shiftEnd: string;
    role: string;
};

type TradeRequestRow = {
    request: ShiftTradeRequest;
    date: string;
    shiftStart: string;
    shiftEnd: string;
    role: string;
    targetEmployee: string;
};

const openShiftRows = computed<OpenShiftRow[]>(() =>
    openShifts.value.map((offer) => ({
        offer,
        date: TimeFormatter.formatDate(offer.shift.startTime),
        shiftStart: TimeFormatter.formatTime(offer.shift.startTime),
        shiftEnd: TimeFormatter.formatTime(offer.shift.endTime),
        role: offer.shift.role?.name ?? "—",
    }))
);

const tradeRequestRows = computed<TradeRequestRow[]>(() =>
    tradeRequests.value.map((request) => ({
        request,
        date: TimeFormatter.formatDate(request.shift.startTime),
        shiftStart: TimeFormatter.formatTime(request.shift.startTime),
        shiftEnd: TimeFormatter.formatTime(request.shift.endTime),
        role: request.shift.role?.name ?? "—",
        targetEmployee: request.targetEmployee?.fullName ?? "—",
    }))
);

const openShiftColumns: TableColumn<OpenShiftRow>[] = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "shiftStart", header: "Start" },
    { accessorKey: "shiftEnd", header: "End" },
    { accessorKey: "role", header: "Role" },
    { id: "actions", meta: { class: { td: "text-right" } } },
];

const tradeRequestColumns: TableColumn<TradeRequestRow>[] = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "shiftStart", header: "Start" },
    { accessorKey: "shiftEnd", header: "End" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "targetEmployee", header: "Requested By" },
    { id: "actions", meta: { class: { td: "text-right" } } },
];

async function takeOpenShift(row: OpenShiftRow) {
    try {
        const employee = await Store.employeeStore.get();
        if (!employee) return;

        await ShiftOfferRequestServices.approve(row.offer);

        openShifts.value = openShifts.value.filter(
            (o) => o.id !== row.offer.id
        );

        toast.add({
            title: "Shift Taken",
            description: "You have successfully taken this shift.",
        });
    } catch (err: any) {
        toast.add({
            title: "Error",
            description: err?.response?.data?.message ?? "Could not take shift.",
            color: "error",
        });
    }
}

async function takeTradeShift(row: TradeRequestRow) {
    try {
        await ShiftTradeRequestServices.approve(row.request);

        tradeRequests.value = tradeRequests.value.filter((r) => r.id !== row.request.id);

        toast.add({
            title: "Trade Accepted",
            description: "You have accepted this trade request.",
        });
    } catch (err: any) {
        toast.add({
            title: "Error",
            description: err?.response?.data?.message ?? "Could not accept trade.",
            color: "error",
        });
    }
}

onMounted(async () => {
    const employee = await Store.employeeStore.get();
    if (!employee) return;

    openShifts.value = await ShiftOfferRequestServices.getAllAcceptedRequestsForBusiness();
    tradeRequests.value = await ShiftTradeRequestServices.getAllForTargetEmployee(employee);
});
</script>

<template>
    <div class="grid grid-cols-2 gap-6 h-full overflow-y-auto">
        <UCard :ui="{ header: 'font-semibold text-black' }">
            <template #header>Open Shifts</template>
            <UTable :columns="openShiftColumns" :data="openShiftRows">
                <template #actions-cell="{ row }">
                    <div class="flex justify-end">
                        <UButton
                            size="sm"
                            @click="takeOpenShift(row.original)"
                        >
                            Take Shift
                        </UButton>
                    </div>
                </template>
            </UTable>
        </UCard>

        <UCard :ui="{ header: 'font-semibold text-black' }">
            <template #header>Shift Trade Requests</template>
            <UTable :columns="tradeRequestColumns" :data="tradeRequestRows">
                <template #actions-cell="{ row }">
                    <div class="flex justify-end">
                        <UButton
                            size="sm"
                            @click="takeTradeShift(row.original)"
                        >
                            Take Shift
                        </UButton>
                    </div>
                </template>
            </UTable>
        </UCard>
    </div>
</template>