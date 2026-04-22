<script setup lang="ts">
import { CalendarData } from "@classes/calendar/calendarData.ts";
import { ShiftEventData } from "@classes/calendar/shiftEventData.ts";
import { onMounted, ref, watch } from "vue";
import { Task } from "@classes/database/task.ts";
import { Store } from "@classes/util/store/store.ts";
import ShiftOfferModal from "./ShiftOfferModal.vue";
import ShiftTradeModal from "./ShiftTradeModal.vue";
import { User } from "@classes/database/user";
import { EmployeeServices } from "../../services/employeeServices";
import { TaskCheckOff } from "@classes/database/taskCheckOff";

const model = defineModel<ShiftEventData>({ required: true });
const { isOpen } = defineProps<{ isOpen: boolean }>();
const emit = defineEmits({ closeRequested: () => true });

const user = ref<User | undefined>(undefined);
const tasks = ref<Task[]>([]);
const isOfferOpen = ref(false);
const isTradeOpen = ref(false);
const isCurrentEmployee = ref(false);

const taskColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorFn: (task: Task) => task.checkOffs.length, header: "Check Offs" },
    { id: "action", header: "" },
];

//test
const shiftDate = "March 17, 2026";
const shiftStart = "9:00 AM";
const shiftEnd = "5:00 PM";
const role = "Im Stuff";
const name = "Max";

onMounted(() => {
    watch(() => isOpen, initializeState);
    if (isOpen) initializeState();
});

async function initializeState() {
    if (!isOpen) return;
    tasks.value = [
        { name: "Open the store", checkOffs: [] } as any,
        { name: "Restock shelves", checkOffs: [] } as any,
        { name: "Clean break room", checkOffs: [] } as any,
    ];
    user.value = await Store.userStore.get();
    const employee = await Store.employeeStore.get();
    isCurrentEmployee.value =
        !!employee && model.value.shift.employee?.id === employee.id;
}

function hasCheckedOff(task: Task): boolean {
    if (!user.value) return false;

    return !!task.checkOffs.find(
        (checkOff) => checkOff.employee.email === user.value!.email,
    );
}

async function checkOff(task: Task): Promise<void> {
    const employee = await Store.employeeStore.get()

    if (employee) task.checkOffs.push(new TaskCheckOff(0, task.id, employee));
}

async function removeCheckOff(task: Task): Promise<void> {
    const employee = await Store.employeeStore.get()

    if (employee) {
        const index = task.checkOffs.findIndex(
            (checkOff) => checkOff.employee.id === employee.id,
        );

        if (index !== -1) task.checkOffs.splice(index, 1);
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
                        <p class="font-medium">{{ shiftDate }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted mb-1">Time</p>
                        <p class="font-medium">
                            {{ shiftStart }} — {{ shiftEnd }}
                        </p>
                    </div>
                </div>
                <USeparator />
                <div class="flex gap-6">
                    <div>
                        <p class="text-xs text-muted mb-1">Role</p>
                        <p class="font-medium">{{ role }}</p>
                    </div>
                    <div>
                        <p class="text-xs text-muted mb-1">Assigned Employee</p>
                        <p class="font-medium">{{ name }}</p>
                    </div>
                </div>
                <USeparator />
                <div>
                    <p class="text-xs text-muted mb-2">Task List</p>
                    <UTable
                        v-if="tasks.length"
                        :data="tasks"
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
                    <template v-if="isCurrentEmployee">
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
