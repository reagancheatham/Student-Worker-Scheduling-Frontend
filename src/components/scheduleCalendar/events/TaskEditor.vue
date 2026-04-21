<script setup lang="ts">
import { Task } from "@classes/database/task.ts";
import { TaskCheckOff } from "@classes/database/taskCheckOff.ts";
import { FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";
import { onMounted, ref, shallowReactive, watch } from "vue";
import { Store } from "@classes/util/store/store.ts";
import { EmployeeServices } from "../../../services/employeeServices.ts";
import { User } from "@classes/database/user.ts";

const model = defineModel<Task>({
    required: true,
});

const { isOpen, creator = false } = defineProps<{
    isOpen: boolean;
    creator?: boolean;
}>();

const emit = defineEmits({
    closeRequested: () => true,
    addRequested: () => true,
    removeChecks: (checkOffs: TaskCheckOff[]) => true,
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

const user = ref<User>();
const checkOffColumns = [
    {
        header: "Checked Off By:",
        accessorFn: (value: TaskCheckOff) => value.employee?.fullName,
        meta: {
            class: {
                td: "max-w-[200px] truncate whitespace-normal",
            },
        },
    },
];

let removedCheckOffs: TaskCheckOff[] = [];

onMounted(() => {
    watch(() => isOpen, initializeState);

    if (isOpen) initializeState();
});

async function initializeState() {
    if (!isOpen) return;

    removedCheckOffs = [];

    state.name = model.value.name;
    state.description = model.value.description;

    user.value = await Store.userStore.get();

    if (model.value.isValid()) model.value.checkOffs = model.value.checkOffs;
    else model.value.checkOffs = [];
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
    else emit("removeChecks", removedCheckOffs);

    toggleModal();
}

function shouldShowCheckOffButton(): boolean {
    if (!user.value) return false;

    return !model.value.checkOffs.find(
        (checkOff) => checkOff.employee.email == user.value!.email,
    );
}

async function checkOff(): Promise<void> {
    const user = await Store.userStore.get();
    const business = await Store.businessStore.get();

    if (!user || !business) {
        console.error("User or business is invalid!");
        return;
    }

    const employee = await EmployeeServices.getEmployeeForUserAndBusiness(
        user,
        business,
    );

    if (employee)
        model.value.checkOffs.push(
            new TaskCheckOff(0, model.value.id, employee),
        );
    else console.error("Could not find employee for user and business!");
}

async function removeCheckOff(): Promise<void> {
    const user = await Store.userStore.get();
    const business = await Store.businessStore.get();

    if (!user || !business) {
        console.error("User or business is invalid!");
        return;
    }

    const employee = await EmployeeServices.getEmployeeForUserAndBusiness(
        user,
        business,
    );

    if (employee) {
        const index = model.value.checkOffs.findIndex(
            (c) => c.employee.id === employee.id,
        );

        if (index !== -1) {
            let checkOff = model.value.checkOffs.splice(index, 1)[0];
            removedCheckOffs.push(checkOff);
        }
    } else console.error("Could not find employee for user and business!");
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
                    <UFormField name="checkOffs">
                        <UTable
                            class="overflow-y-auto flex-1 h-3/12 max-h-48"
                            :data="model.checkOffs"
                            :columns="checkOffColumns"
                            :ui="{
                                td: 'py-1',
                                th: 'py-1',
                            }"
                            :sticky="true"
                            empty="No Check Offs"
                        >
                            <template #body-bottom>
                                <UButton
                                    v-if="shouldShowCheckOffButton()"
                                    class="w-full mt-1"
                                    block
                                    label="Check Off"
                                    variant="soft"
                                    size="sm"
                                    color="neutral"
                                    @click="checkOff()"
                                />
                                <UButton
                                    v-if="!shouldShowCheckOffButton()"
                                    class="w-full mt-1"
                                    block
                                    label="Remove Check Off"
                                    variant="soft"
                                    size="sm"
                                    @click="removeCheckOff()"
                                />
                            </template>
                        </UTable>
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
