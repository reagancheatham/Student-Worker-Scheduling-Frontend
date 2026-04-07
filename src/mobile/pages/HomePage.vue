<script setup lang="ts">
import { ref } from "vue";
import { ShiftServices } from "../../services/shiftServices";
import { EmployeeServices } from "../../services/employeeServices";
import { Shift } from "@classes/database/shift";
import { Employee } from "@classes/database/employee";

//TODO: What happens when there is not shifts this week?
//TODO: sort shifts in order of nearest, its order of inserted rn
//TODO: add clock in functionality, (i need to show minutes clocked??)

const user = ref(JSON.parse(localStorage.getItem("user")));
const employee = ref<Employee | null>(null);
let shifts = ref<Shift[]>([]);

let today = new Date();
let upcoming = new Date();
upcoming.setDate(today.getDate() + 30);
upcoming.setHours(24, 59, 59, 99);

console.log(today);
console.log(upcoming);

async function loadData() {
    try {
        const employeeData = await EmployeeServices.getForUserID(user.value.id);
        employee.value = employeeData;

        const result = await ShiftServices.getAllInRangeForEmployee(
            employeeData.id,
            today,
            upcoming,
        );

        shifts.value = result;

        console.log(employeeData.id);
        console.log(`shifts: ${shifts.value.length}`);
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

            <!-- TODO: make badge dynmaic -->
            <div class="pt-3 pl-7">
                <UBadge
                    size="lg"
                    color="primary"
                    variant="soft"
                    class="w-80 pl-4"
                >
                    Your Next Shift Starts Soon
                </UBadge>
            </div>

            <div class="flex flex-col gap-1 pt-2 pl-10">
                <div class="flex flex-row items-end gap-3">
                    <UIcon name="i-lucide-calendar" class="size-5" />
                    <div>{{ shifts[0]?.dateFormatted }}</div>
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
                        label="View Shift Task"
                        size="xl"
                    />
                </div>
            </div>
        </div>

        <!-- Upcoming Schedule -->
        <div class="pl-6 pt-5 font-bold text-lg shrink-0">Upcoming Shifts</div>

        <div class="flex-1 overflow-y-auto px-1 pb-33">
            <div class="p-3 space-y-3">
                <UPageCard v-for="shift in shifts" orientation="horizontal">
                    <div class="grid grid-cols-6 place-items-center">
                        <div class="col-span-1">
                            <div class="text-center text-lg font-bold">
                                {{ shift.day }}
                            </div>
                            <div class="text-center">
                                {{ shift.month }}
                            </div>
                        </div>
                        <!-- TODO: make day and time line up on ui -->
                        <div class="grid col-span-4 place-items-center">
                            <div class="font-bold text-center">
                                {{ shift.shiftTime }}
                            </div>
                            <UButton variant="link"> View Task List </UButton>
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
