<script setup lang="ts">
import { CompleteStatus, Task } from "@classes/database/task.ts";
import { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";
import { onMounted, shallowReactive, watch } from "vue";

const model = defineModel<Task>({
    required: true,
});

const { isOpen, creator = false } = defineProps<{
    isOpen: boolean;
    creator?: boolean;
}>();

const emit = defineEmits({
    closeRequested: () => true,
});

const schema = v.pipe(
    v.object({
        name: v.pipe(v.string(), v.nonEmpty("Name is required")),
        description: v.string(),
        completeStatus: v.enum(CompleteStatus),
    }),
);
type Schema = v.InferOutput<typeof schema>;

const state = shallowReactive<{
    name: string;
    description: string;
    completeStatus: CompleteStatus;
}>({
    name: model.value.name,
    description: model.value.description,
    completeStatus: model.value.completeStatus,
});

onMounted(() => {
    watch(
        () => isOpen,
        (value) => {
            if (value) {
                state.name = model.value.name;
                state.description = model.value.description;
                state.completeStatus = model.value.completeStatus;
            }
        },
    );
});

function toggleModal(): void {
    if (!isOpen) return;

    emit("closeRequested");
}

function submitModalForm(_: FormSubmitEvent<Schema>): void {
    const task = model.value;
    const name = state.name;
    const description = state.description;
    const completeStatus = state.completeStatus;

    task.name = name;
    task.description = description;
    task.completeStatus = completeStatus;

    toggleModal();
}
</script>

<template>
    <UModal
        :open="isOpen"
        :title="creator ? 'Task Creator' : 'Task Editor'"
        description="Edit the details of a shift task."
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
