<script setup lang="ts">
import { ref, onMounted, shallowReactive, reactive } from "vue";
import type { TableColumn, FormSubmitEvent } from "@nuxt/ui";
import { Store } from "@classes/util/store/store.ts";
import { ApprovalStatus } from "@classes/util/approvalStatus.ts";
import { TimeOffRequestServices } from "../../services/timeOffServices.ts";
import * as valibot from "valibot";
import {
    CalendarDate,
    getLocalTimeZone,
    today,
    Time,
} from "@internationalized/date";
import { TimeOffRequest } from "@classes/database/timeOffRequest.ts";

type TimeOffRow = {
    id: number;
    date: string;
    startTime: string;
    endTime: string;
    reason: string;
    status: ApprovalStatus;
};

const data = ref<TimeOffRow[]>([]);
const globalFilter = ref("");
const isAddOpen = ref(false);
const toastNotification = useToast();
const startOpen = ref(false);
const endOpen = ref(false);

const addState = reactive({
    startDate: today(getLocalTimeZone()) as CalendarDate,
    endDate: today(getLocalTimeZone()) as CalendarDate,
    startTime: new Time(8, 0),
    endTime: new Time(17, 0),
    reason: "",
});

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

const addValidationSchema = valibot.object({
    reason: valibot.pipe(
        valibot.string(),
        valibot.nonEmpty("Reason is required"),
    ),
});
type AddValidationSchema = valibot.InferOutput<typeof addValidationSchema>;

const statusColor: Record<ApprovalStatus, "warning" | "success" | "error"> = {
    [ApprovalStatus.Pending]: "warning",
    [ApprovalStatus.Approved]: "success",
    [ApprovalStatus.Denied]: "error",
    [ApprovalStatus.Unsubmitted]: "warning",
};

const columns: TableColumn<TimeOffRow>[] = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "startTime", header: "Start Time" },
    { accessorKey: "endTime", header: "End Time" },
    { accessorKey: "reason", header: "Reason" },
    { accessorKey: "status", header: "Status" },
    {
        id: "actions",
        meta: { class: { td: "text-right" } },
    },
];

onMounted(() => getData());

async function getData() {
    try {
        const employee = await Store.employeeStore.get();
        if (!employee) return;
        const requests =
            await TimeOffRequestServices.getAllForEmployee(employee);
        data.value = requests.map((r: any) => ({
            id: r.id,
            date: new Date(r.startDate).toLocaleDateString(),
            startTime: new Date(r.startDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            endTime: new Date(r.endDate).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            }),
            reason: r.reason,
            status: r.status ?? ApprovalStatus.Pending,
        }));
    } catch (error) {
        console.error(`Error fetching time off requests: ${error}`);
    }
}

async function submitAdd(_: FormSubmitEvent<AddValidationSchema>) {
    isAddOpen.value = false;
    try {
        const employee = await Store.employeeStore.get();
        if (!employee) return;

        const startDate = addState.startDate.toDate(getLocalTimeZone());
        startDate.setHours(
            addState.startTime.hour,
            addState.startTime.minute,
            0,
            0,
        );

        const endDate = addState.endDate.toDate(getLocalTimeZone());
        endDate.setHours(addState.endTime.hour, addState.endTime.minute, 0, 0);

        await TimeOffRequestServices.create(
            new TimeOffRequest(
                -1,
                employee,
                startDate,
                endDate,
                addState.reason,
                ApprovalStatus.Pending,
            ),
        );

        toastNotification.add({
            title: "Request Submitted",
            description: "Your time off request has been submitted.",
        });
        getData();
    } catch (err: any) {
        toastNotification.add({
            title: "Submission Failed",
            description:
                err?.response?.data?.message ?? "Could not submit request.",
            color: "error",
        });
    }
}
</script>

<template>
    <div class="h-full flex flex-col">
        <div class="flex flex-row gap-2 mb-3">
            <UInput
                v-model="globalFilter"
                class="max-w-sm"
                placeholder="Search time off requests..."
            />
            <UButton
                icon="i-lucide-plus"
                label="Submit Time Off Request"
                @click="isAddOpen = true"
            />
        </div>

        <UTable
            sticky
            class="flex-1"
            v-model:global-filter="globalFilter"
            :data="data"
            :columns="columns"
        >
            <template #status-cell="{ row }">
                <UBadge
                    :color="statusColor[row.original.status]"
                    variant="subtle"
                >
                    {{ row.original.status }}
                </UBadge>
            </template>
        </UTable>
    </div>
    <UModal
        v-model:open="isAddOpen"
        title="Submit Time Off Request"
        description="Fill out the details for your time off request."
    >
        <template #content>
            <div class="p-4">
                <UForm
                    :schema="addValidationSchema"
                    :state="addState"
                    class="flex flex-col gap-5"
                    @submit="submitAdd"
                >
                    <UFormField label="Start Date" name="startDate">
                        <UPopover v-model:open="startOpen">
                            <UButton
                                color="neutral"
                                variant="outline"
                                icon="i-lucide-calendar"
                                class="w-full justify-start"
                            >
                                {{
                                    dateFormatter.format(
                                        addState.startDate.toDate(
                                            getLocalTimeZone(),
                                        ),
                                    )
                                }}
                            </UButton>
                            <template #content>
                                <UCalendar
                                    v-model="addState.startDate as CalendarDate"
                                    prevent-deselect
                                    @update:model-value="startOpen = false"
                                />
                            </template>
                        </UPopover>
                    </UFormField>
                    <UFormField label="Start Time" name="startTime">
                        <UInputTime v-model="addState.startTime as Time" />
                    </UFormField>
                    <UFormField label="End Date" name="endDate">
                        <UPopover v-model:open="endOpen">
                            <UButton
                                color="neutral"
                                variant="outline"
                                icon="i-lucide-calendar"
                                class="w-full justify-start"
                            >
                                {{
                                    dateFormatter.format(
                                        addState.endDate.toDate(
                                            getLocalTimeZone(),
                                        ),
                                    )
                                }}
                            </UButton>
                            <template #content>
                                <UCalendar
                                    v-model="addState.endDate as CalendarDate"
                                    prevent-deselect
                                    @update:model-value="endOpen = false"
                                />
                            </template>
                        </UPopover>
                    </UFormField>
                    <UFormField label="End Time" name="endTime">
                        <UInputTime v-model="addState.endTime as Time" />
                    </UFormField>
                    <UFormField label="Reason" name="reason">
                        <UTextarea
                            v-model="addState.reason"
                            class="w-full"
                            :rows="5"
                            placeholder="Please describe the reason for your time off request..."
                        />
                    </UFormField>
                    <div class="flex gap-2 justify-end">
                        <UButton type="submit">Submit</UButton>
                        <UButton
                            variant="outline"
                            color="neutral"
                            @click="isAddOpen = false"
                        >
                            Cancel
                        </UButton>
                    </div>
                </UForm>
            </div>
        </template>
    </UModal>
</template>
