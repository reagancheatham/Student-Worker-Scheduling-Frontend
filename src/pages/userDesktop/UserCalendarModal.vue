<script setup lang="ts">
import { ShiftEventData } from "@classes/calendar/shiftEventData.ts";
import { onMounted, ref } from "vue";
import { Task } from "@classes/database/task.ts";
import { Store } from "@classes/util/store/store.ts";
import ShiftOfferModal from "./ShiftOfferModal.vue";
import ShiftTradeModal from "./ShiftTradeModal.vue";
import { TaskCheckOff } from "@classes/database/taskCheckOff";
import { Month } from "@classes/util/month.ts";
import { TaskServices } from "../../services/taskServices.ts";
import { Employee } from "@classes/database/employee.ts";

const model = defineModel<ShiftEventData>({ required: true });
const { isOpen } = defineProps<{ isOpen: boolean }>();
const emit = defineEmits({ closeRequested: () => true });

const currentEmployee = ref<Employee>();
const isOfferOpen = ref(false);
const isTradeOpen = ref(false);
const taskColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorFn: (task: Task) => task.checkOffs.length, header: "Check Offs" },
    { id: "action", header: "" },
];

onMounted(async () => {
    currentEmployee.value = await Store.employeeStore.get();
});

function hasCheckedOff(task: Task): boolean {
    const user = Store.userStore.getImmediate();

    if (!user) return false;

    const checkOff = task.checkOffs.find((c) => {
        return c.employee.email === user.email;
    });

    if (checkOff) return true;
    else return false;
}

async function checkOff(task: Task): Promise<void> {
    if (currentEmployee.value) {
        let checkOff = new TaskCheckOff(0, task.id, currentEmployee.value);

        const result = await TaskServices.createCheckOff(checkOff);
        checkOff.id = result.id;

        task.checkOffs = [...task.checkOffs, checkOff];
    }
}

async function removeCheckOff(task: Task): Promise<void> {
    if (currentEmployee.value) {
        const index = task.checkOffs.findIndex(
            (checkOff) => checkOff.employee.id === currentEmployee.value!.id,
        );

        if (index !== -1) {
            const checkOff = task.checkOffs[index];
            task.checkOffs.splice(index, 1);

            await TaskServices.deleteCheckOff(checkOff);
        }
    }
}

function close() {
    emit("closeRequested");
}
</script>

<template>
    <UModal
        :open="isOpen"
        title="Shift Details"
        description="View the details of your shift."
        @update:open="close()"
    >
        <template #content>
            <div class="p-4 flex flex-col gap-4">
                <div>
                    <p class="text-lg font-semibold">{{ model.name }}</p>
                </div>
                <USeparator />
                <div class="flex gap-6">
                    <div>
                        <p class="text-xs text-muted mb-1">Date</p>
                        <p class="font-medium">
                            {{
                                `${Month.getMonth(model.startTime.toDate().getMonth()).fullName} ${model.startTime.day}`
                            }}
                        </p>
                    </div>
                    <div>
                        <p class="text-xs text-muted mb-1">Time</p>
                        <p class="font-medium">
                            {{ model.startTime.toTimeString() }} —
                            {{ model.endTime.toTimeString() }}
                        </p>
                    </div>
                </div>
                <USeparator />
                <div class="flex gap-6">
                    <div>
                        <p class="text-xs text-muted mb-1">Role</p>
                        <p class="font-medium">{{ model.shift.role?.name }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted mb-1">Assigned Employee</p>
                        <p class="font-medium">
                            {{ model.shift.employee?.fullName }}
                        </p>
                    </div>
                </div>
                <USeparator />
                <div>
                    <p class="text-xs text-muted mb-2">Task List</p>
                    <UTable
                        v-if="model.shift?.taskList?.tasks"
                        :data="model.shift.taskList.tasks"
                        :columns="taskColumns"
                        class="max-h-48 overflow-y-auto"
                        sticky="header"
                        :ui="{ td: 'py-1', th: 'py-1' }"
                    >
                        <template #action-cell="{ row }">
                            <UButton
                                v-if="!hasCheckedOff(row.original)"
                                label="Check Off"
                                variant="soft"
                                size="sm"
                                color="neutral"
                                @click="checkOff(row.original)"
                            />
                            <UButton
                                v-else
                                label="Remove"
                                variant="soft"
                                size="sm"
                                @click="removeCheckOff(row.original)"
                            />
                        </template>
                    </UTable>
                    <p v-else class="text-sm text-muted">No tasks assigned.</p>
                </div>
                <USeparator />
                <div class="flex justify-end gap-2">
                    <template
                        v-if="
                            model.shift.employee &&
                            model.shift.employee.id === currentEmployee?.id
                        "
                    >
                        <UButton
                            color="neutral"
                            variant="outline"
                            @click="isOfferOpen = true"
                        >
                            Offer Shift
                        </UButton>
                        <UButton
                            color="neutral"
                            variant="outline"
                            @click="isTradeOpen = true"
                        >
                            Trade Shift
                        </UButton>
                    </template>
                    <UButton color="neutral" variant="outline" @click="close()">
                        Close
                    </UButton>
                </div>
            </div>
        </template>
    </UModal>

    <ShiftOfferModal
        v-model="model"
        :is-open="isOfferOpen"
        @close-requested="isOfferOpen = false"
    />
    <ShiftTradeModal
        v-model="model"
        :is-open="isTradeOpen"
        @close-requested="isTradeOpen = false"
    />
</template>
