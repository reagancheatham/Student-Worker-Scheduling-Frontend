<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { TradeServices } from "../../services/tradeServices";
import { Store } from "@classes/util/store/store";
import { ShiftTradeRequest } from "@classes/database/shiftTradeRequests";
import { Business } from "@classes/database/business";
import { DateFormatter } from "../../classes/util/dateFormatter";
import ShiftDetailsModal from "../modals/ShiftDetailsModal.vue";
import { User } from "@classes/database/user";
import { Employee } from "@classes/database/employee";
import { EmployeeServices } from "../../services/employeeServices";
import { ShiftOfferRequest } from "@classes/database/shiftOfferRequest.ts";

const business = ref<Business>();
const user = ref<User>();
const userEmployee = ref<Employee>();
const tradeRequests = ref<ShiftTradeRequest[]>([]);
const offerRequests = ref<ShiftOfferRequest[]>([]);
const pendingTradeRequests = ref<ShiftTradeRequest[]>([]);
const pendingOfferRequests = ref<ShiftOfferRequest[]>([]);

type PendingRequestItem =
    | (ShiftTradeRequest & { type: "trade" })
    | (ShiftOfferRequest & { type: "offer" });

const pendingRequests = computed<PendingRequestItem[]>(() => [
    ...pendingTradeRequests.value.map((r) => ({
        ...r,
        type: "trade" as const,
    })),
    ...pendingOfferRequests.value.map((r) => ({
        ...r,
        type: "offer" as const,
    })),
]);

const overlay = useOverlay();
const shiftModal = overlay.create(ShiftDetailsModal);

onMounted(async () => {
    business.value = await Store.businessStore.get();
    user.value = await Store.userStore.get();
    userEmployee.value = await EmployeeServices.getEmployeeForUserAndBusiness(
        user.value,
        business.value,
    );

    await loadData();
});

async function openShiftModal(shiftData, isTrade) {
    shiftModal.open({
        shift: shiftData,
        name: business.value.name,
        isTrade: isTrade,

        onAccept: async (accepted: boolean) => {
            if (!accepted) return; //not sure when ill hit this

            try {
                if (isTrade) {
                    const trade: ShiftTradeRequest = {
                        ...shiftData,
                        approvalStatus: "Pending",
                    };

                    await TradeServices.updateTradeRequest(trade);
                } else {
                    const offer: ShiftOfferRequest = {
                        ...shiftData,
                        approvalStatus: "Pending",
                    };

                    await TradeServices.updateOfferedShift(offer);
                }

                await loadData();
                shiftModal.close();
            } catch (err) {
                console.error("Error submitting request:", err);
            }
        },
    });
}

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
        //I need to filter this by target
        tradeRequests.value = (
            await TradeServices.getAllAvailableTradeRequests(business.value.id)
        ).filter((r) => r.targetEmployeeID === userEmployee.value.id);

        //removes your own shift offers...
        offerRequests.value = (
            await TradeServices.getAllAvailableOfferedShifts(business.value.id)
        ).filter((r) => r.userID !== user.value.id);

        //filter to only see your own pending items
        pendingTradeRequests.value = (
            await TradeServices.getAllPendingTradeRequests(business.value.id)
        ).filter(
            (r) =>
                r.targetEmployeeID === userEmployee.value.id,
        );

        pendingOfferRequests.value = (
            await TradeServices.getAllPendingOfferedShifts(business.value.id)
        ).filter(
            (r) =>
                r.userID === user.value.id ||
                r.claimingEmployeeID === userEmployee.value.id,
        );
    } catch (err) {
        console.error(err);
    }
}
</script>

<template>
    <UTabs :items="tabs">
        <template #trade>
            <div class="border-b-1 border-gray-300 pb-3">
                <div class="text-center pt-5 font-bold text-xl">
                    Trade Board
                </div>
            </div>

            <div class="flex h-screen">
                <div class="flex-1 overflow-y-auto px-1 pb-60">
                    <div class="p-3 space-y-3">
                        <UPageCard
                            v-for="shift in tradeRequests"
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
                            v-for="shift in offerRequests"
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
                        <UPageCard v-for="shift in pendingRequests">
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
                                        Swapping with {{ shift.firstName }}
                                        {{ shift.lastName }}
                                    </div>
                                    <div>
                                        {{
                                            DateFormatter.shiftTime(
                                                shift.startTime,
                                                shift.endTime,
                                            )
                                        }}
                                    </div>
                                    <div
                                        v-if="
                                            shift.approvalStatus === 'Pending'
                                        "
                                        class="flex items-center gap-2 text-warning"
                                    >
                                        <UIcon name="i-lucide-clock" />
                                        <span> Pending Approval... </span>
                                    </div>
                                    <div
                                        v-if="
                                            shift.approvalStatus === 'Approved'
                                        "
                                        class="flex items-center gap-2 text-success"
                                    >
                                        <UIcon name="i-lucide-circle-check" />
                                        <span> Swap Approved! </span>
                                    </div>
                                    <div
                                        v-if="shift.approvalStatus === 'Denied'"
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
