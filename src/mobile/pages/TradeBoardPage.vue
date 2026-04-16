<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { TradeServices } from '../../services/tradeServices';
import { Store } from "@classes/util/store.ts";
import { ShiftTradeRequest } from '@classes/database/shiftTradeRequests';
import { ShiftOfferRequest } from '@classes/database/shiftOfferRequests';
import { Business } from '@classes/database/business';

const business = ref<Business>();
const tradeRequests = ref<ShiftTradeRequest[]>([]);
const offerRequests = ref<ShiftOfferRequest[]>([]);
const pendingTradeRequests = ref<ShiftTradeRequest[]>([]);
const pendingOfferRequests = ref<ShiftOfferRequest[]>([]);

console.log("trades", tradeRequests);
console.log("offers", offerRequests);

onMounted(async () => {
    business.value = await Store.getBusiness();
    await loadData();
});

const tabs = [
    {
        label: "Trade Board",
        slot: "trade",
    },
    {
        label: "Pending",
        slot: "pending",
    },
];

async function loadData() {
    try {
        tradeRequests.value = await TradeServices.getAllAvailableTradeRequests(business.value.id);
        offerRequests.value = await TradeServices.getAllAvailableOfferedShifts(business.value.id);
        pendingTradeRequests.value = await TradeServices.getAllPendingTradeRequests(business.value.id);
        pendingOfferRequests.value = await TradeServices.getAllPendingOfferedShifts(business.value.id);
    } catch (err) {
        console.error(err);
    }
}
</script>

<template>
    <UTabs :items="tabs">
        <template #trade>
            <div class="text-center pt-5 font-bold text-xl">Trade Board</div>

            <div class="overflow-y-auto px-1">
                <div class="p-3 space-y-3">
                    <UPageCard v-for="shift in tradeRequests" orientation="horizontal">
                        <div>Test</div>
                    </UPageCard>
                </div>
            </div>
        </template>
        <template #pending>
            <div class="text-center pt-5 font-bold text-xl">
                Pending Approval
            </div>
        </template>
    </UTabs>
</template>
