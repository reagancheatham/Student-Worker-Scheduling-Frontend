<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { TimeSheetsServices } from "../../services/timesheetsServices.ts";
import { Store } from "@classes/util/store/store.ts";

type TimeSheetRow = {
    date: string;
    startTime: string;
    endTime: string;
    shiftName: string;
    role: string;
    totalTime: string;
};

const data = ref<TimeSheetRow[]>([]);
const globalFilter = ref("");

const columns: TableColumn<TimeSheetRow>[] = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "startTime", header: "Start Time" },
    { accessorKey: "endTime", header: "End Time" },
    { accessorKey: "shiftName", header: "Shift Name" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "totalTime", header: "Total Time Worked" },
    {
        id: "actions",
        meta: { class: { td: "text-right" } },
    },
];

onMounted(() => {
    getData();
});

async function getData() {
    try {
        const employee = await Store.employeeStore.get();

        if (!employee) return;

        const timesheets = await TimeSheetsServices.getAllForEmployee(
            employee.id,
        );

        data.value = timesheets.map((timesheet: any) => {
            const clockIn = new Date(timesheet.clockIn);
            const clockOut = new Date(timesheet.clockOut);
            const totalMinutes = Math.round(
                (clockOut.getTime() - clockIn.getTime()) / 60000,
            );
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            return {
                date: clockIn.toLocaleDateString(),
                startTime: clockIn.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                endTime: clockOut.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                shiftName: timesheet.shift.name ?? "—",
                role: timesheet.shift?.targetRoleID ?? "—",
                totalTime: `${hours}h ${minutes}m`,
            };
        });
    } catch (error) {
        console.error(`Error fetching timesheets: ${error}`);
    }
}
</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex flex-row gap-2 mb-3">
            <UInput
                v-model="globalFilter"
                class="max-w-sm"
                placeholder="Search timesheets..."
            />
        </div>

        <UTable
            sticky
            class="flex-1"
            v-model:global-filter="globalFilter"
            :data="data"
            :columns="columns"
        >
        </UTable>
    </div>
</template>
