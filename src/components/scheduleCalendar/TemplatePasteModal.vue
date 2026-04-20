<script setup lang="ts">
import { ScheduleShiftTemplate } from "@classes/database/scheduleShiftTemplate.ts";
import { onMounted, ref } from "vue";
import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { ScheduleTemplateServices } from "../../services/scheduleTemplateServices.ts";
import { Store } from "@classes/util/store/store.ts";

const { isOpen } = defineProps<{
    isOpen: boolean;
}>();

const selectedTemplate = ref<ScheduleTemplate>();
const shiftTemplates = ref<ScheduleTemplate[]>([]);

onMounted(async () => {
    const business = await Store.businessStore.get();

    if (!business) return;

    shiftTemplates.value = await ScheduleTemplateServices.getAllForBusiness(
        business?.id,
    );
});
</script>

<template>
    <UModal :open="isOpen" title="Paste Template">
        <template #body>
            <USelectMenu
                v-model="selectedTemplate"
                :items="shiftTemplates"
                label-key="name"
            />
        </template>
        <template #footer>
            <UButton class="ml-auto" label="Paste" />
            <UButton label="Cancel" color="neutral" variant="outline" />
        </template>
    </UModal>
</template>
