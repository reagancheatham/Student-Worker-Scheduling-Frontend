<script setup lang="ts">
import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { onMounted, ref } from "vue";
import { ScheduleTemplateServices } from "../services/scheduleTemplateServices.ts";
import { Store } from "@classes/util/store.ts";

const selectedTemplate = ref<ScheduleTemplate>();
const scheduleTemplates = ref<ScheduleTemplate[]>([]);

onMounted(async () => {
    const business = await Store.getBusiness();

    if (!business) return;

    scheduleTemplates.value = await ScheduleTemplateServices.getAllForBusiness(
        business.id,
    );
});

async function createTemplate(): Promise<void> {
    const business = await Store.getBusiness();

    if (!business) return;

    selectedTemplate.value = new ScheduleTemplate(
        0,
        business.id,
        "New Schedule Template",
    );
}
</script>

<style>
.templateCreator {
    height: 100vh;
}

.scheduleContainer {
    height: 82vh;
    padding-bottom: 20px;
}

body {
    overflow: hidden;
}
</style>

<template>
    <div v-if="selectedTemplate" class="scheduleContainer">
        <ScheduleCalendar header editable :template="selectedTemplate" />
    </div>
    <UCard
        v-else
        class="templateCreator"
        :ui="{ body: 'h-full justify-items-center content-center text-center' }"
    >
        <template #default>
            <div class="flex gap-4">
                <div>
                    <p>Select Template to Edit</p>
                    <USelectMenu
                        :model-value="selectedTemplate"
                        class="w-48"
                        :items="scheduleTemplates"
                        label-key="name"
                    />
                </div>
                <p class="self-end">or</p>
                <UButton
                    class="h-1/2 self-end"
                    label="Create New Template"
                    @click="createTemplate"
                />
            </div>
        </template>
    </UCard>
</template>
