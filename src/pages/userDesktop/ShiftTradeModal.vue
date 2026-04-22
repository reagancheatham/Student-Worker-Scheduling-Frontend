<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ShiftEventData } from "@classes/calendar/shiftEventData.ts";
import { ShiftTradeRequest } from "@classes/database/shiftTradeRequest.ts";
import { ShiftTradeRequestServices } from "../../services/shiftTradeRequestServices.ts";
import { EmployeeServices } from "../../services/employeeServices.ts";
import { Employee } from "@classes/database/employee.ts";
import { Store } from "@classes/util/store/store.ts";

const model = defineModel<ShiftEventData>({ required: true });
const { isOpen } = defineProps<{ isOpen: boolean }>();
const emit = defineEmits({ closeRequested: () => true });

const tradeReason = ref("");
const selectedTradeEmployee = ref<Employee | undefined>(undefined);
const employees = ref<Employee[]>([]);
const toastNotification = useToast();

onMounted(() => {
    watch(() => isOpen, init);
    if (isOpen) init();
});

async function init() {
    if (!isOpen) return;
    const business = await Store.businessStore.get();
    if (business)
        employees.value = await EmployeeServices.getAllForBusiness(business.id);
}

async function submitTrade() {
    if (!selectedTradeEmployee.value) return;
    try {
        const request = new ShiftTradeRequest(
            0,
            selectedTradeEmployee.value,
            model.value.shift,
            tradeReason.value,
            new Date(),
        );

        await ShiftTradeRequestServices.create(request);
        toastNotification.add({
            title: "Trade Requested",
            description: "Your shift trade request has been submitted.",
        });
        tradeReason.value = "";
        selectedTradeEmployee.value = undefined;
        emit("closeRequested");
    } catch (err: any) {
        toastNotification.add({
            title: "Failed",
            description:
                err?.response?.data?.message ?? "Could not submit trade.",
            color: "error",
        });
    }
}
</script>

<template>
    <UModal
        :open="isOpen"
        title="Trade Shift"
        description="Request a specific employee to swap shifts with you."
    >
        <template #content>
            <div class="p-4 flex flex-col gap-4">
                <UFormField label="Trade With">
                    <USelectMenu
                        v-model="selectedTradeEmployee"
                        :items="employees"
                        label-key="fullName"
                        placeholder="Select an employee"
                        class="w-full"
                    />
                </UFormField>
                <UFormField label="Reason">
                    <UTextarea
                        v-model="tradeReason"
                        class="w-full"
                        :rows="4"
                        placeholder="Why do you want to trade this shift?"
                    />
                </UFormField>
                <div class="flex justify-end gap-2">
                    <UButton
                        :disabled="!selectedTradeEmployee"
                        @click="submitTrade"
                        >Submit</UButton
                    >
                    <UButton
                        variant="outline"
                        color="neutral"
                        @click="emit('closeRequested')"
                        >Cancel</UButton
                    >
                </div>
            </div>
        </template>
    </UModal>
</template>
