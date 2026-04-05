<script setup lang="ts">
import { Shift } from "@classes/database/shift";
import { Time } from "@internationalized/date";
import { description } from "valibot";
import { ref } from "vue";

const user = ref(JSON.parse(localStorage.getItem("user")));
console.log(user);

const shifts = [
    {
        month: "April",
        day: "24",
        time: "9:00 A.M. to 12:00 P.M.",
    },
    {
        month: "April",
        day: "25",
        time: "9:00 A.M. to 4:00 P.M.",
    },
    {
        month: "April",
        day: "26",
        time: "9:00 A.M. to 2:00 P.M.",
    },
    {
        month: "April",
        day: "27",
        time: "9:00 A.M. to 2:00 P.M.",
    },
];
</script>

<template>
    <div class="h-screen overflow-hidden flex flex-col">
        <div class="flex-shrink-0">
            <div class="pl-6 pt-6 font-bold w-full text-xl">
                Welcome back, {{ user?.firstName }}
            </div>

            <div class="pt-6 pl-7">
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
                    <div>Thursday, July 25th</div>
                </div>
                <div class="flex flex-row items-end gap-3">
                    <UIcon name="i-lucide-clock" class="size-5" />
                    <div>9:00 A.M. - 2:00 P.M.</div>
                </div>
                <div class="flex flex-row items-end gap-3">
                    <UIcon name="i-lucide-building-2" class="size-5" />
                    <div>The Brew</div>
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
        <div class="pl-6 pt-5 font-bold text-lg flex-shrink-0">
            Upcoming Shifts
        </div>

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
                                {{ shift.time }}
                            </div>
                            <UButton variant="link">
                                View Task List
                            </UButton>
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
