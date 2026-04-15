<script setup lang="ts">
import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { onMounted, ref } from "vue";
import { ScheduleTemplateServices } from "../services/scheduleTemplateServices.ts";
import { Store } from "@classes/util/store.ts";
import { TempStore } from "@classes/util/tempStore.ts";

const selectedTemplate = ref<ScheduleTemplate>();
const scheduleTemplates = ref<ScheduleTemplate[]>([]);

onMounted(async () => {
    await updateTemplatesList();
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

async function saveTemplate(): Promise<void> {
    if (!selectedTemplate.value) return;

    TempStore.isLoading = true;

    if (selectedTemplate.value.id === 0)
        await ScheduleTemplateServices.create(selectedTemplate.value);
    else
        await ScheduleTemplateServices.update(selectedTemplate.value);

    await updateTemplatesList();

    selectedTemplate.value = undefined;
    TempStore.isLoading = false;
}

function cancelEdit(): void {
    selectedTemplate.value = undefined;
}

async function updateTemplatesList(): Promise<void> {
    const business = await Store.getBusiness();

    if (!business) return;

    scheduleTemplates.value = await ScheduleTemplateServices.getAllForBusiness(
        business.id,
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
        <div class="flex mt-14 mr-16 gap-4">
            <UButton
                class="ml-auto"
                label="Save"
                size="xl"
                @click="saveTemplate()"
            />
            <UModal
                title="Discard all changes?"
                :ui="{ content: 'sm:max-w-xs' }"
            >
                <UButton
                    label="Cancel Edit"
                    size="xl"
                    variant="outline"
                    color="neutral"
                />

                <template #footer="{ close }">
                    <UButton
                        label="Discard"
                        class="ml-auto"
                        @click="cancelEdit()"
                    />
                    <UButton
                        label="Return To Editing"
                        color="neutral"
                        variant="outline"
                        class="mr-auto"
                        @click="close()"
                    />
                </template>
            </UModal>
        </div>
    </div>
    <UCard
        v-else
        class="templateCreator"
        :ui="{ body: 'h-full justify-items-center content-center text-center bg-neutral-100' }"
    >
        <template #default>
            <div class="flex gap-4 mb-32">
                    <USelectMenu
                        v-model="selectedTemplate"
                        :items="scheduleTemplates"
                        label-key="name"
                        placeholder="Select a Template to Edit"
                    />
                <p class="mt-1">or</p>
                <UButton
                    class="h-1/2 self-end"
                    label="Create New Template"
                    @click="createTemplate"
                />
            </div>
        </template>
    </UCard>
</template>
