<script setup lang="ts">
import { CompleteStatus, Task } from "@classes/database/task.ts";
import { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";
import { shallowReactive } from "vue";
import { TaskServices } from "../../../services/taskServices.ts";

const model = defineModel<Task>({
    required: true,
});

const { isOpen, creator = false } = defineProps<{
    isOpen: boolean;
    creator?: boolean;
}>();

const emit = defineEmits({
    closeRequested: () => true,
    formSubmitted: () => true,
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

    if (task.id)
        TaskServices.update(task).then(() => emit("formSubmitted"));
    else
        TaskServices.create(task).then(() => emit("formSubmitted"));

    toggleModal();
}
</script>

<template>
    <UModal>
        
    </UModal>
</template>
