<script setup lang="ts">
import { ref } from "vue";
import { ShiftServices } from "../../services/shiftServices";
import { EmployeeServices } from "../../services/employeeServices";
import { Shift } from "@classes/database/shift";
import { Employee } from "@classes/database/employee";

//TODO: What happens when there is not shifts this week? Need UI for empty
//TODO: add clock in functionality, timeSheets service.
//TODO: Does Clock In need to be present the whole time? maybe make it so it says view shift when it isnt time to clock?
//TODO: prob find better solution to fill space then that link

const user = ref(JSON.parse(localStorage.getItem("user")));
const employee = ref<Employee | null>(null);
let shifts = ref<Shift[]>([]);

let today = new Date();
let upcoming = new Date();
upcoming.setDate(today.getDate() + 30);
upcoming.setHours(23, 59, 59, 99);

console.log(today);

async function loadData() {
    try {
        const employeeData = await EmployeeServices.getForUserID(user.value.id);
        employee.value = employeeData;

        let result = await ShiftServices.getAllInRangeForEmployee(
            employeeData.id,
            today,
            upcoming,
        );

        //TODO: test this works
        //if there are no shifts in 30 days, push search back 120 days.
        //A terrible way to handle this but ill think about it later
        if (result.length == 0) {
            upcoming.setDate(upcoming.getDate() + 120);

            result = await ShiftServices.getAllInRangeForEmployee(
                employeeData.id,
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

loadData();


</script>

<template>
    <div class="h-screen overflow-hidden flex flex-col">
        <div class="shrink-0">
            <div class="pl-6 pt-6 font-bold w-full text-xl">
                Welcome back, {{ user?.firstName }}
            </div>

            <div class="pt-3 pl-7">
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

            <div class="flex flex-col gap-1 pt-2 pl-10">
                <div class="flex flex-row font-semibold">
                    Your Next Shift...
                </div>
                <div class="flex flex-row items-end gap-3">
                    <UIcon name="i-lucide-calendar" class="size-5" />
                    <div>{{ shifts[0]?.weekday }} {{ shifts[0]?.dateFormatted }}</div>
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
                        class="w-75 items-center justify-center p-3"
                        label="Clock In"
                        size="xl"
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
        <div class="pl-6 pt-5 font-bold text-lg shrink-0">Upcoming Shifts</div>

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
                                You are scheduled for {{ shift.getShiftLength() }} on {{ shift.weekday }}
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
