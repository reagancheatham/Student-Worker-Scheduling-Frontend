<script setup lang="ts">
import { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";
import { onMounted, shallowReactive, watch } from "vue";
import { ShiftTaskTemplate } from "@classes/database/shiftTaskTemplate.ts";

const model = defineModel<ShiftTaskTemplate>({
    required: true,
});

const { isOpen, creator = false } = defineProps<{
    isOpen: boolean;
    creator?: boolean;
}>();

const emit = defineEmits({
    closeRequested: () => true,
    addRequested: () => true,
});

const schema = v.pipe(
    v.object({
        name: v.pipe(v.string(), v.nonEmpty("Name is required")),
        description: v.string(),
    }),
);
type Schema = v.InferOutput<typeof schema>;

const state = shallowReactive<{
    name: string;
    description: string;
}>({
    name: model.value.name,
    description: model.value.description,
});

onMounted(() => {
    watch(() => isOpen, initializeState);

    if (isOpen) initializeState();
});

async function initializeState() {
    if (!isOpen) return;

    state.name = model.value.name;
    state.description = model.value.description;
}

function toggleModal(): void {
    if (!isOpen) return;

    emit("closeRequested");
}

function submitModalForm(_: FormSubmitEvent<Schema>): void {
    const task = model.value;
    const name = state.name;
    const description = state.description;

    task.name = name;
    task.description = description;

    if (creator) emit("addRequested");

    toggleModal();
}
</script>

<template>
    <UModal
        :open="isOpen"
        :title="creator ? 'Task Creator' : 'Task Editor'"
        description="Edit the details of a shift task."
        :ui="{ content: 'sm:max-w-xs' }"
        @update:open="toggleModal()"
    >
        <template #content>
            <div class="p-2 flex flex-row">
                <p class="text-xl font-semibold ml-2">
                    {{ creator ? "Task Creator" : "Task Editor" }}
                </p>
            </div>
            <div class="p-4">
                <UForm
                    :schema="schema"
                    :state="state"
                    class="flex flex-col gap-4"
                    @submit="submitModalForm"
                >
                    <UFormField label="Name" name="name">
                        <UInput v-model="state.name" />
                    </UFormField>
                    <UFormField label="Description" name="description">
                        <UInput v-model="state.description" />
                    </UFormField>
                    <div class="flex flex-row gap-2">
                        <UButton class="ml-auto" type="submit">
                            Submit
                        </UButton>
                        <UButton
                            variant="outline"
                            color="neutral"
                            @click="toggleModal()"
                        >
                            Cancel
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UModal>
</template>
