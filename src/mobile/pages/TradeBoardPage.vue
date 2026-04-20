<script setup lang="ts">
import { Component, onMounted, ref } from "vue";
import { TradeServices } from "../../services/tradeServices";
import { Store } from "@classes/util/store.ts";
import { ShiftTradeRequest } from "@classes/database/shiftTradeRequests";
import { ShiftOfferRequest } from "@classes/database/shiftOfferRequests";
import { Business } from "@classes/database/business";
import { DateFormatter } from "../../classes/util/dateFormatter";
import { ApprovalStatus } from "@classes/util/approvalStatus";
import ShiftDetailsModal from "../modals/ShiftDetailsModal.vue";
import { Overlay } from "@nuxt/ui/runtime/composables/useOverlay.js";

const business = ref<Business>();
const tradeRequests = ref<ShiftTradeRequest[]>([]);
const offerRequests = ref<ShiftOfferRequest[]>([]);
const pendingTradeRequests = ref<ShiftTradeRequest[]>([]);
const pendingOfferRequests = ref<ShiftOfferRequest[]>([]);

const overlay = useOverlay();
const modal = overlay.create(ShiftDetailsModal);

console.log("trades", tradeRequests);
console.log("offers", offerRequests);

onMounted(async () => {
    business.value = await Store.getBusiness();
    await loadData();
});


async function openShiftModal(shiftData, isTrade) {
    modal.open({
        shift: shiftData,
        name: business.value.name,
        isTrade: isTrade
    });
}

const testTrades = [
    new ShiftTradeRequest(
        1,
        101,
        201,
        "I have a wedding on Saturday so I can't make my shift. I would love if you could take this shift.",
        new Date(),
        ApprovalStatus.Unsubmitted,
        new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        new Date(Date.now() + 32 * 60 * 60 * 1000), // tomorrow + 8h
        "Gregg",
        "Dicky",
    ),
    new ShiftTradeRequest(
        2,
        102,
        202,
        "I'm feeling unwell and won't be able to work my shift. Would you be able to cover for me?",
        new Date(),
        ApprovalStatus.Unsubmitted,
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // day after tomorrow
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        "Jane",
        "Smith",
    ),
    new ShiftTradeRequest(
        3,
        103,
        203,
        "I have a doctor's appointment that conflicts with my shift. Happy to swap or owe you one!",
        new Date(),
        ApprovalStatus.Pending,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // next week
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        "Mike",
        "Johnson",
    ),
];

const testOffers = [
    new ShiftOfferRequest(
        1,
        101,
        201,
        "I'm available to cover this shift if you need the day off. Let me know!",
        new Date(),
        ApprovalStatus.Unsubmitted,
        new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        new Date(Date.now() + 32 * 60 * 60 * 1000), // tomorrow + 8h
        "Alice",
        "Brown",
    ),
    new ShiftOfferRequest(
        2,
        102,
        202,
        "Happy to take this shift, I'm free that day.",
        new Date(),
        ApprovalStatus.Unsubmitted,
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // day after tomorrow
        new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        "Bob",
        "Wilson",
    ),
    new ShiftOfferRequest(
        3,
        103,
        203,
        "I can work this shift for you, just need to swap my availability.",
        new Date(),
        ApprovalStatus.Pending,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // next week
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
        "Carol",
        "Davis",
    ),
];

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
        tradeRequests.value = await TradeServices.getAllAvailableTradeRequests(
            business.value.id,
        );
        offerRequests.value = await TradeServices.getAllAvailableOfferedShifts(
            business.value.id,
        );
        pendingTradeRequests.value =
            await TradeServices.getAllPendingTradeRequests(business.value.id);
        pendingOfferRequests.value =
            await TradeServices.getAllPendingOfferedShifts(business.value.id);

        //TODO: sort pending data so that approved and denied shifts are on top
    } catch (err) {
        console.error(err);
    }
}
</script>

<template>
    <UTabs :items="tabs">
        <template #trade>
            <div
                class="text-center pt-5 pb-3 font-bold text-xl border-b-1 border-gray-300"
            >
                Trade Board
            </div>

            <div class="flex h-screen">
                <div class="flex-1 overflow-y-auto px-1 pb-60">
                    <div class="p-3 space-y-3">
                        <UPageCard
                            v-for="shift in testTrades"
                            orientation="horizontal"
                            class="border-4 border-maroon-500"
                            @click="openShiftModal(shift, true)"
                        >
                            <div class="flex justify-between items-center">
                                <div class="font-bold">
                                    {{ shift.fullName }}
                                </div>
                                <div>
                                    {{
                                        DateFormatter.dateFormatted(
                                            shift.startTime,
                                        )
                                    }}
                                </div>
                            </div>
                            <div>
                                {{ shift.employeeMessage }}
                            </div>
                            <div
                                class="flex items-center justify-center font-bold"
                            >
                                {{
                                    DateFormatter.startTimeFormatted(
                                        shift.startTime,
                                    )
                                }}
                                -
                                {{
                                    DateFormatter.endTimeFormatted(
                                        shift.endTime,
                                    )
                                }}
                            </div>
                        </UPageCard>
                        <UPageCard
                            v-for="shift in testOffers"
                            orientation="horizontal"
                            @click="openShiftModal(shift, false)"
                        >
                            <div class="flex justify-between items-center">
                                <div class="font-bold">
                                    {{ shift.fullName }}
                                </div>
                                <div>
                                    {{
                                        DateFormatter.dateFormatted(
                                            shift.startTime,
                                        )
                                    }}
                                </div>
                            </div>
                            <div>
                                {{ shift.employeeMessage }}
                            </div>
                            <div
                                class="flex items-center justify-center font-bold"
                            >
                                {{
                                    DateFormatter.startTimeFormatted(
                                        shift.startTime,
                                    )
                                }}
                                -
                                {{
                                    DateFormatter.endTimeFormatted(
                                        shift.endTime,
                                    )
                                }}
                            </div>
                        </UPageCard>
                    </div>
                </div>
            </div>
        </template>
        <template #pending>
            <div
                class="text-center pt-5 pb-3 font-bold text-xl border-b-1 border-gray-300"
            >
                Pending Approval
            </div>
            <div class="flex h-screen">
                <div class="flex-1 overflow-y-auto px-1 pb-60">
                    <div class="p-3 space-y-3">
                        <UPageCard v-for="shift in testTrades">
                            <div class="grid grid-cols-4">
                                <div class="col-span-3">
                                    <div class="font-bold">
                                        {{
                                            DateFormatter.dateFormatted(
                                                shift.startTime,
                                            )
                                        }}
                                    </div>
                                    <div>
                                        Swaping with {{ shift.fullName }},
                                        {{
                                            DateFormatter.shiftTime(
                                                shift.startTime,
                                                shift.endTime,
                                            )
                                        }}
                                    </div>
                                    <div
                                        v-if="shift.status === 'Pending'"
                                        class="flex items-center gap-2 text-warning"
                                    >
                                        <UIcon name="i-lucide-clock" />
                                        <span> Pending Approval... </span>
                                    </div>
                                    <div
                                        v-if="shift.status === 'Approved'"
                                        class="flex items-center gap-2 text-success"
                                    >
                                        <UIcon name="i-lucide-circle-check" />
                                        <span> Swap Approved! </span>
                                    </div>
                                    <div
                                        v-if="shift.status === 'Denied'"
                                        class="flex items-center gap-2 text-error"
                                    >
                                        <UIcon name="i-lucide-circle-x" />
                                        <span> Swap Request Denied... </span>
                                    </div>
                                </div>
                            </div>
                        </UPageCard>
                    </div>
                </div>
            </div>
        </template>
    </UTabs>
</template>
