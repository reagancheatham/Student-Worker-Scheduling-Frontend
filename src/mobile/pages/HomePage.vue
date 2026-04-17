<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { ShiftServices } from "../../services/shiftServices";
import { EmployeeServices } from "../../services/employeeServices";
import { Shift } from "@classes/database/shift";
import { Employee } from "@classes/database/employee";
import { Timesheet } from "@classes/database/timesheet";
import { TimeSheetsServices } from "../../services/timesheetsServices";
import { Store } from "@classes/util/store.ts";
import { Business } from "@classes/database/business.ts";

//TODO: What happens when there is not shifts this week? Need UI for empty

const user = ref(Store.getUser());
const business = ref<Business>();
const employee = ref<Employee | null>(null);
const currentShift = computed(() => shifts.value[0]);
//this function will need to be hooked up to settings somehow
//for now i will just make this wrap shift.isStartingSoon()
const canClockIn = computed(() => shifts.value[0]?.isStartingSoon());
const clockedIn = ref(false);
const shifts = ref<Shift[]>([]);
const timesheet = ref<Timesheet | null>(null);

let today = new Date();
let upcoming = new Date();
upcoming.setDate(today.getDate() + 30);
upcoming.setHours(23, 59, 59, 99);

onMounted(async () => {
    business.value = await Store.getBusiness();
    loadData();
});

async function loadData() {
    try {
        const employeeData =
            await EmployeeServices.getEmployeeForUserAndBusiness(
                user.value!,
                business.value!,
            );

        employee.value = employeeData!;

        let result = await ShiftServices.getAllInRangeForEmployee(
            employee.value.id,
            today,
            upcoming,
        );

        //TODO: test this works
        //if there are no shifts in 30 days, push search back 120 days.
        //A terrible way to handle this but ill think about it later
        if (result.length == 0) {
            upcoming.setDate(upcoming.getDate() + 120);

            result = await ShiftServices.getAllInRangeForEmployee(
                employee.value.id,
                today,
                upcoming,
            );
        }

        const sortedShifts = result.sort((a, b) => {
            return a.startTime.getTime() - b.startTime.getTime();
        });

        shifts.value = sortedShifts;
    } catch (err) {
        console.log(err);
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
    <div class="h-screen w-full overflow-hidden flex flex-col items-center">
        <div class="shrink-0">
            <div class="pt-6 font-bold w-full text-xl">
                Welcome back, {{ user?.firstName }}
            </div>

            <div class="pt-3">
                <UBadge
                    size="lg"
                    color="primary"
                    variant="soft"
                    class="w-80 pl-4"
                    v-if="shifts[0]?.isStartingSoon()"
                >
                    Your Next Shift Starts Soon
                </UBadge>
                <!-- TODO: add late badge -->
            </div>

            <div class="flex flex-col gap-1 pt-2">
                <div class="flex flex-row font-semibold">
                    Your Next Shift...
                </div>
                <div class="flex flex-row items-end gap-3">
                    <UIcon name="i-lucide-calendar" class="size-5" />
                    <div>
                        {{ shifts[0]?.weekday }} {{ shifts[0]?.dateFormatted }}
                    </div>
                </div>
                <div class="flex flex-row items-end gap-3">
                    <UIcon name="i-lucide-clock" class="size-5" />
                    <div>{{ shifts[0]?.shiftTime }}</div>
                </div>
                <!-- TODO: will need to get business name, hardcoded for now -->
                <div class="flex flex-row items-end gap-3">
                    <UIcon name="i-lucide-building-2" class="size-5" />
                    <div>Business Name</div>
                </div>
                <div class="flex flex-row pt-8">
                    <UButton
                        v-if="!clockedIn"
                        class="w-75 items-center justify-center p-3"
                        label="Clock In"
                        size="xl"
                        :icon="!canClockIn ? 'i-lucide-lock' : undefined"
                        :disabled="!canClockIn"
                        @click="clockIn"
                    />
                    <UButton
                        v-if="clockedIn"
                        class="w-75 items-center justify-center p-3"
                        label="Clock Out"
                        variant="subtle"
                        size="xl"
                        @click="clockOut"
                    />
                </div>
                <div class="flex flex-row pt-3">
                    <UButton
                        variant="outline"
                        class="w-75 items-center justify-center p-3"
                        label="View Shift Tasks"
                        size="xl"
                    />
                </div>
            </div>
        </div>

        <!-- Upcoming Schedule -->
        <div class="pt-5 font-bold text-lg shrink-0">Upcoming Shifts</div>

        <div class="flex-1 overflow-y-auto px-1 pb-33">
            <div class="p-3 space-y-3">
                <UPageCard
                    v-for="shift in shifts.slice(1)"
                    orientation="horizontal"
                >
                    <div class="grid grid-cols-6 place-items-center">
                        <div class="col-span-1">
                            <div class="text-center text-lg font-bold">
                                {{ shift.day }}
                            </div>
                            <div class="text-center">
                                {{ shift.month }}
                            </div>
                        </div>
                        <div class="grid col-span-4 place-items-center">
                            <div class="font-bold text-center">
                                {{ shift.shiftTime }}
                            </div>
                            <div class="text-center text-sm">
                                You are scheduled for
                                {{ shift.getShiftLength() }} on
                                {{ shift.weekday }}
                            </div>
                        </div>
                        <div class="col-span-1">
                            <UIcon
                                name="i-lucide-chevron-right"
                                class="size-6"
                            />
                        </div>
                    </div>
                </UPageCard>
            </div>
        </div>
    </div>
</template>
