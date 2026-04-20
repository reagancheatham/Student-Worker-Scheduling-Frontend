<script setup lang="ts">
import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { onMounted, ref, watch } from "vue";
import { ScheduleTemplateServices } from "../services/scheduleTemplateServices.ts";
import { Store } from "@classes/util/store/store.ts";
import { TempStore } from "@classes/util/store/tempStore.ts";

const possibleSelectedTemplate = ref<ScheduleTemplate>();
const selectedTemplate = ref<ScheduleTemplate>();
const scheduleTemplates = ref<ScheduleTemplate[]>([]);
const isDeleteModalOpen = ref(false);

onMounted(async () => {
    selectedTemplate.value = Store.lastEditedTemplateStore.getUnsafe();

    const lastEditedTemplate = await Store.lastEditedTemplateStore.get();

    if (lastEditedTemplate) selectedTemplate.value = lastEditedTemplate;

    watch(
        selectedTemplate,
        () => {
            if (selectedTemplate.value)
                Store.lastEditedTemplateStore.set(selectedTemplate.value);
            else Store.lastEditedTemplateStore.clear();
        },
        { deep: true },
    );

    await updateTemplatesList();
});

async function createTemplate(): Promise<void> {
    const business = await Store.businessStore.get();

    if (!business) return;

    const newTemplate = await ScheduleTemplateServices.create(
        new ScheduleTemplate(0, business.id, "New Schedule Template"),
    );

    selectedTemplate.value = newTemplate;
}

async function deleteTemplate(): Promise<void> {
    if (!possibleSelectedTemplate.value) return;

    isDeleteModalOpen.value = false;
    await ScheduleTemplateServices.delete(possibleSelectedTemplate.value);
}

function selectTemplate(): void {
    selectedTemplate.value = possibleSelectedTemplate.value;
}

function cancelEdit(): void {
    updateTemplatesList();
    selectedTemplate.value = undefined;
}

async function updateTemplatesList(): Promise<void> {
    TempStore.isLoading = true;

    const business = await Store.businessStore.get();

    if (!business) return;

    scheduleTemplates.value = await ScheduleTemplateServices.getAllForBusiness(
        business.id,
    );

    TempStore.isLoading = false;
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
        <ScheduleCalendar
            header
            editable
            :template="selectedTemplate"
            @close-requested="cancelEdit()"
        />
    </div>
    <UCard
        v-else
        class="templateCreator"
        :ui="{
            body: 'h-full justify-items-center content-center text-center bg-neutral-100',
        }"
    >
        <template #default>
            <div class="flex gap-4 mb-4">
                <div>
                    <USelectMenu
                        class="w-52"
                        v-model="possibleSelectedTemplate"
                        :items="scheduleTemplates"
                        :disabled="TempStore.isLoading"
                        :loading="TempStore.isLoading"
                        label-key="name"
                        placeholder="Select a Template to Edit"
                        clear
                    />
                    <div
                        v-if="possibleSelectedTemplate"
                        class="flex gap-4 mt-2 justify-center"
                    >
                        <UButton label="Edit" @click="selectTemplate()" />
                        <UButton
                            label="Delete"
                            variant="outline"
                            color="neutral"
                            @click="isDeleteModalOpen = true"
                        />
                        <UModal
                            :title="`Delete template ${possibleSelectedTemplate.name}?`"
                            description="Deletion can not be undone."
                            :ui="{ content: 'sm:max-w-xs' }"
                            :open="isDeleteModalOpen"
                        >
                            <template #footer="{ close }">
                                <UButton
                                    label="Delete"
                                    class="ml-auto"
                                    @click="deleteTemplate()"
                                />
                                <UButton
                                    label="Cancel"
                                    color="neutral"
                                    variant="outline"
                                    class="mr-auto"
                                    @click="isDeleteModalOpen = false"
                                />
                            </template>
                        </UModal>
                    </div>
                </div>

                <p class="mt-1">or</p>
                <UButton
                    class="self-start"
                    label="Create New Template"
                    @click="createTemplate"
                />
            </div>
        </template>
    </UCard>
</template>
