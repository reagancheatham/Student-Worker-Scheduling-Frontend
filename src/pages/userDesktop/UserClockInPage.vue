<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ShiftServices } from "../../services/shiftServices.ts";
import { EmployeeServices } from "../../services/employeeServices.ts";
import { Shift } from "@classes/database/shift.ts";
import { Employee } from "@classes/database/employee.ts";
import { Timesheet } from "@classes/database/timesheet.ts";
import { TimeSheetsServices } from "../../services/timesheetsServices.ts";
import { Store } from "@classes/util/store/store.ts";
import { Business } from "@classes/database/business.ts";
import { User } from "@classes/database/user.ts";

const user = ref<User>();
const business = ref<Business>();
const currentShift = computed(() => {
    const now = new Date();
    return (
        shifts.value.find((s) => s.startTime <= now && s.endTime >= now) ??
        shifts.value[0]
    );
});
const canClockIn = computed(() => shifts.value[0]?.isStartingSoon());
const clockedIn = ref(false);
const shifts = ref<Shift[]>([]);
const timesheet = ref<Timesheet | null>(null);

let today = new Date();
let upcoming = new Date();
upcoming.setDate(today.getDate() + 30);
upcoming.setHours(23, 59, 59, 99);

onMounted(async () => {
    user.value = await Store.userStore.get();
    business.value = await Store.businessStore.get();
    loadData();
});

async function loadData() {
    try {
        const employee = await Store.employeeStore.get();

        if (!employee) return;

        let result = await ShiftServices.getAllInRangeForEmployee(
            employee.id,
            today,
            upcoming,
        );

        if (result.length == 0) {
            upcoming.setDate(upcoming.getDate() + 120);
            result = await ShiftServices.getAllInRangeForEmployee(
                employee.id,
                today,
                upcoming,
            );
        }

        shifts.value = result.sort(
            (a, b) => a.startTime.getTime() - b.startTime.getTime(),
        );
    } catch (error: any) {
        console.log(error);
    }
}

async function clockIn() {
    try {
        const newTimesheet = new Timesheet(
            0,
            currentShift.value.id,
            new Date(),
            undefined,
        );
        const data = await TimeSheetsServices.create(newTimesheet);
        timesheet.value = data;
        clockedIn.value = true;
    } catch (err) {
        console.error("Failed to clock in: ", err);
    }
}

async function clockOut() {
    try {
        const activeTimesheet = timesheet.value!;
        activeTimesheet.clockOut = new Date();
        await TimeSheetsServices.update(activeTimesheet);
        clockedIn.value = false;
        timesheet.value = null;
    } catch (err) {
        console.error("Failed to clock out: ", err);
    }
}
</script>

<template>
    <div class="h-full flex flex-col gap-6 p-6">
        <div>
            <h1 class="text-2xl font-bold">
                Welcome back, {{ user?.firstName }}
            </h1>
            <p class="text-muted text-sm mt-1">
                Here's your schedule for today.
            </p>
        </div>

        <div class="grid grid-cols-3 gap-6 flex-1 min-h-0">
            <UCard class="col-span-2 flex flex-col">
                <template #header>
                    <div class="flex items-center justify-between">
                        <p class="font-semibold text-lg">Current Shift</p>
                        <UBadge
                            v-if="currentShift?.isStartingSoon() && !clockedIn"
                            color="warning"
                            variant="subtle"
                        >
                            Starting Soon
                        </UBadge>
                        <UBadge
                            v-if="clockedIn"
                            color="success"
                            variant="subtle"
                        >
                            Clocked In
                        </UBadge>
                    </div>
                </template>

                <div v-if="currentShift" class="flex flex-col gap-5">
                    <div class="grid grid-cols-3 gap-4">
                        <div class="flex flex-col gap-1">
                            <p class="text-xs text-muted">Date</p>
                            <div class="flex items-center gap-2">
                                <UIcon
                                    name="i-lucide-calendar"
                                    class="size-4 text-muted"
                                />
                                <p class="font-medium">
                                    {{ currentShift.weekday }},
                                    {{ currentShift.dateFormatted }}
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col gap-1">
                            <p class="text-xs text-muted">Time</p>
                            <div class="flex items-center gap-2">
                                <UIcon
                                    name="i-lucide-clock"
                                    class="size-4 text-muted"
                                />
                                <p class="font-medium">
                                    {{ currentShift.shiftTime }}
                                </p>
                            </div>
                        </div>
                        <div class="flex flex-col gap-1">
                            <p class="text-xs text-muted">Duration</p>
                            <div class="flex items-center gap-2">
                                <UIcon
                                    name="i-lucide-timer"
                                    class="size-4 text-muted"
                                />
                                <p class="font-medium">
                                    {{ currentShift.getShiftLength() }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <USeparator />

                    <div class="flex gap-3">
                        <UButton
                            v-if="!clockedIn"
                            size="lg"
                            :icon="
                                !canClockIn
                                    ? 'i-lucide-lock'
                                    : 'i-lucide-log-in'
                            "
                            :disabled="!canClockIn"
                            @click="clockIn"
                        >
                            Clock In
                        </UButton>
                        <UButton
                            v-else
                            size="lg"
                            variant="subtle"
                            icon="i-lucide-log-out"
                            @click="clockOut"
                        >
                            Clock Out
                        </UButton>
                    </div>
                </div>

                <div v-else class="text-muted text-sm">
                    No upcoming shifts found.
                </div>
            </UCard>
            <UCard class="flex flex-col min-h-0">
                <template #header>
                    <p class="font-semibold text-lg">Upcoming Shifts</p>
                </template>

                <div class="flex flex-col gap-3 overflow-y-auto flex-1">
                    <div
                        v-if="shifts.slice(1).length === 0"
                        class="text-muted text-sm"
                    >
                        No upcoming shifts.
                    </div>
                    <div
                        v-for="shift in shifts.slice(1)"
                        :key="shift.id"
                        class="flex items-center gap-4 p-3 rounded-lg border border-default hover:bg-elevated transition-colors"
                    >
                        <div class="text-center min-w-10">
                            <p class="text-xl font-bold leading-none">
                                {{ shift.day }}
                            </p>
                            <p class="text-xs text-muted uppercase">
                                {{ shift.shortMonth }}
                            </p>
                        </div>
                        <USeparator orientation="vertical" class="h-8" />
                        <div class="flex-1 min-w-0">
                            <p class="font-medium text-sm truncate">
                                {{ shift.shiftTime }}
                            </p>
                            <p class="text-xs text-muted truncate">
                                {{ shift.getShiftLength() }}
                            </p>
                        </div>
                        <UIcon
                            name="i-lucide-chevron-right"
                            class="size-4 text-muted shrink-0"
                        />
                    </div>
                </div>
            </UCard>
        </div>
    </div>
</template>
