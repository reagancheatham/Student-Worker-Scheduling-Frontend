<script setup lang="ts">
import { ref } from "vue";
import { ShiftEventData } from "@classes/calendar/shiftEventData.ts";
import { ShiftOfferRequest } from "@classes/database/shiftOfferRequest.ts";
import { ShiftOfferRequestServices } from "../../services/shiftOfferRequestServices.ts";

const model = defineModel<ShiftEventData>({ required: true });
const { isOpen } = defineProps<{ isOpen: boolean }>();
const emit = defineEmits({ closeRequested: () => true });

const offerReason = ref("");
const toastNotification = useToast();

async function submitOffer() {
    try {
        await ShiftOfferRequestServices.create(
            new ShiftOfferRequest(
                -1,
                model.value.shift,
                offerReason.value,
                new Date(),
            )
        );
        toastNotification.add({
            title: "Shift Offered",
            description: "Your shift offer has been submitted.",
        });
        offerReason.value = "";
        emit("closeRequested");
    } catch (err: any) {
        toastNotification.add({
            title: "Failed",
            description: err?.response?.data?.message ?? "Could not submit offer.",
            color: "error",
        });
    }
}
</script>

<template>
    <UModal :open="isOpen" title="Offer Shift" description="Put your shift up for anyone to take.">
        <template #content>
            <div class="p-4 flex flex-col gap-4">
                <UFormField label="Reason">
                    <UTextarea
                        v-model="offerReason"
                        class="w-full"
                        :rows="4"
                        placeholder="Why are you offering this shift?"
                    />
                </UFormField>
                <div class="flex justify-end gap-2">
                    <UButton @click="submitOffer">Submit</UButton>
                    <UButton variant="outline" color="neutral" @click="emit('closeRequested')">Cancel</UButton>
                </div>
            </div>
        </template>
    </UModal>
</template>