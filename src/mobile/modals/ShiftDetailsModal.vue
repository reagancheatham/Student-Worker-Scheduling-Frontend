<script setup lang="ts">
import { DateFormatter } from "@classes/util/dateFormatter";

defineProps<{
    shift: any; //sorry rag
    name: string;
    isTrade: boolean;
}>();

const emit = defineEmits<{
    accept: [boolean],
}>();

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
                        {{
                            DateFormatter.shiftTime(shift.startTime, shift.endTime)
                        }}
                    </div>
                </div>
                <div class="flex flex-row items-end gap-3">
                    <UIcon name="i-lucide-building-2" class="size-5" />
                    <div>{{ name }}</div>
                </div>
                <div class="flex justify-center gap-10 pt-3">
                    <UButton
                        class="w-20 justify-center"
                        label="Accept"
                        size="xl"
                        @click="emit('accept', true)"
                    ></UButton>
                    <UButton
                        class="w-20 justify-center"
                        label="Deny"
                        size="xl"
                        v-if="isTrade === true"
                    ></UButton>
                </div>
            </div>
        </template>
    </UModal>
</template>
