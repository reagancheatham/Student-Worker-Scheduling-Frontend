<script setup lang="ts">
import { Business } from "@classes/database/business";
import { DateFormatter } from "@classes/util/dateFormatter";
import { ref } from "vue";

const props = defineProps<{
    shift: any;
    business: Business;
    isTrade: boolean;
    swapable: boolean;
}>();

const emit = defineEmits<{
    accept: [boolean];
    offerToAll: [];
    tradeWith: [employeeId: string | number];
}>();

type SwapMode = "choose" | "offer" | "trade";
const swapMode = ref<SwapMode>("choose");
const selectedEmployeeId = ref<string | number | null>(null);
</script>

<template>
    <UModal :title="shift.fullName">
        <template #body>
            <div class="space-y-1">
                {{ shift.employeeMessage }}

                <div class="flex flex-row items-end gap-3 pt-3">
                    <UIcon name="i-lucide-calendar" class="size-5" />
                    <div>
                        {{ DateFormatter.weekday(shift.startTime) }}
                        {{ DateFormatter.dateFormatted(shift.startTime) }}
                    </div>
                </div>
                <div class="flex flex-row items-end gap-3">
                    <UIcon name="i-lucide-clock" class="size-5" />
                    <div>
                        {{ DateFormatter.shiftTime(shift.startTime, shift.endTime) }}
                    </div>
                </div>
                <div class="flex flex-row items-end gap-3">
                    <UIcon name="i-lucide-building-2" class="size-5" />
                    <div>{{ business?.name }}</div>
                </div>

                <div class="pt-4">
                    <!-- Non-swapable -->
                    <div v-if="!swapable" class="flex justify-center">
                        <UButton
                            class="w-20 justify-center"
                            label="Accept"
                            size="xl"
                            @click="emit('accept', true)"
                        />
                    </div>

                    <!-- Swapable -->
                    <template v-else>
                        <!-- Choose mode -->
                        <div v-if="swapMode === 'choose'" class="flex flex-col gap-2">
                            <UButton
                                block
                                variant="outline"
                                size="xl"
                                icon="i-lucide-users"
                                label="Offer to anyone"
                                @click="swapMode = 'offer'"
                            />
                            <UButton
                                block
                                variant="outline"
                                size="xl"
                                icon="i-lucide-arrow-left-right"
                                label="Trade with specific employee"
                                @click="swapMode = 'trade'"
                            />
                        </div>

                        <!-- Offer to all -->
                        <div v-else-if="swapMode === 'offer'" class="space-y-3">
                            <UAlert
                                icon="i-lucide-info"
                                description="This shift will be visible to all eligible employees to pick up."
                            />
                            <div class="flex gap-2">
                                <UButton variant="ghost" icon="i-lucide-arrow-left" @click="swapMode = 'choose'" />
                                <UButton block label="Offer Shift" icon="i-lucide-send" @click="emit('offerToAll')" />
                            </div>
                        </div>

                        <!-- Trade with employee -->
                        <div v-else-if="swapMode === 'trade'" class="space-y-3">
                            <USelect
                                v-model="selectedEmployeeId"
                                :options="employees?.map(e => ({ label: e.name, value: e.id })) ?? []"
                                placeholder="Select an employee..."
                            />
                            <div class="flex gap-2">
                                <UButton variant="ghost" icon="i-lucide-arrow-left" @click="swapMode = 'choose'" />
                                <UButton
                                    block
                                    label="Send Trade Request"
                                    icon="i-lucide-arrow-left-right"
                                    :disabled="selectedEmployeeId === null"
                                    @click="emit('tradeWith', selectedEmployeeId!)"
                                />
                            </div>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </UModal>
</template>
