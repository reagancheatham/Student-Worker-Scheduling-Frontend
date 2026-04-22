<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import type { TableColumn } from "@nuxt/ui";
import { AppNotification } from "@classes/util/appNotification";
import { MessageNotificationServices } from "../services/notifications/messageNotificationServices";
import { ShiftTradeRequestNotificationServices } from "../services/notifications/shfitTradeRequestNotificationServices";
import { ShiftOfferRequestNotificationServices } from "../services/notifications/shiftOfferRequestNotificationServices";
import { TimeOffRequestNotificationServices } from "../services/notifications/timeOffRequestNotificationServices";

const toast = useToast();

const shiftOfferRequestNotifications = ref<AppNotification[]>([]);
const shiftTradeRequestNotifications = ref<AppNotification[]>([]);
const timeOffRequestNotifications = ref<AppNotification[]>([]);
const messageNotifications = ref<AppNotification[]>([]);

type ShiftOfferRequestRow = {
    notification: AppNotification;
    employeeName: string;
    shiftStartTime: string;
    shiftEndTime: string;
    offerMessage: string;
};

type ShiftTradeRequestRow = {
    notification: AppNotification;
    requestingEmployeeName: string;
    targetEmployeeName: string;
    shiftStartTime: string;
    shiftEndTime: string;
    tradeMessage: string;
};

type TimeOffRequestRow = {
    notification: AppNotification;
    employeeName: string;
    timeOffStartDate: string;
    timeOffEndDate: string;
    reasonMessage: string;
};

type MessageNotificationRow = {
    notification: AppNotification;
    messageType: string;
    messageContent: string;
};

function formatDateWithTime(date: Date): string {
    return new Date(date).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    });
}

function formatDateOnly(date: Date): string {
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function removeNotificationFromList(
    notificationList: typeof shiftOfferRequestNotifications,
    removedNotificationID: number,
) {
    notificationList.value = notificationList.value.filter(
        (notification) => notification.id !== removedNotificationID,
    );
}

function showSuccessToast(description: string) {
    toast.add({
        title: "Approved",
        description,
        color: "green",
        icon: "i-lucide-check-circle",
    });
}

function showDeniedToast(description: string) {
    toast.add({
        title: "Denied",
        description,
        color: "red",
        icon: "i-lucide-x-circle",
    });
}

function showErrorToast() {
    toast.add({
        title: "Error",
        description: "Something went wrong.",
        color: "red",
        icon: "i-lucide-triangle-alert",
    });
}

function buildShiftOfferRequestRow(
    notification: AppNotification,
): ShiftOfferRequestRow {
    const shift =
        notification.shiftOfferRequestNotification!.shiftOfferRequest.shift;
    return {
        notification,
        employeeName: shift.employee?.fullName ?? "Unknown Employee",
        shiftStartTime: formatDateWithTime(shift.startTime),
        shiftEndTime: formatDateWithTime(shift.endTime),
        offerMessage:
            notification.shiftOfferRequestNotification!.shiftOfferRequest
                .employeeMessage,
    };
}

function buildShiftTradeRequestRow(
    notification: AppNotification,
): ShiftTradeRequestRow {
    const tradeRequest =
        notification.shiftTradeRequestNotification!.shiftTradeRequest;
    return {
        notification,
        requestingEmployeeName:
            tradeRequest.shift!.employee!.fullName ?? "Unknown Employee",
        targetEmployeeName:
            tradeRequest.targetEmployee?.fullName ?? "Unknown Employee",
        shiftStartTime: formatDateWithTime(tradeRequest.shift!.startTime),
        shiftEndTime: formatDateWithTime(tradeRequest.shift!.endTime),
        tradeMessage: tradeRequest.employeeMessage,
    };
}

function buildTimeOffRequestRow(
    notification: AppNotification,
): TimeOffRequestRow {
    const timeOffRequest =
        notification.timeOffRequestNotification!.timeOffRequest;
    return {
        notification,
        employeeName: timeOffRequest.employee?.fullName ?? "Unknown Employee",
        timeOffStartDate: formatDateOnly(timeOffRequest.startDate),
        timeOffEndDate: formatDateOnly(timeOffRequest.endDate),
        reasonMessage: timeOffRequest.reason,
    };
}

function buildMessageNotificationRow(
    notification: AppNotification,
): MessageNotificationRow {
    return {
        notification,
        messageType: notification.messageNotification!.notificationType,
        messageContent: notification.messageNotification!.message,
    };
}

const shiftOfferRequestRows = computed<ShiftOfferRequestRow[]>(() =>
    shiftOfferRequestNotifications.value.map(buildShiftOfferRequestRow),
);

const shiftTradeRequestRows = computed<ShiftTradeRequestRow[]>(() =>
    shiftTradeRequestNotifications.value.map(buildShiftTradeRequestRow),
);

const timeOffRequestRows = computed<TimeOffRequestRow[]>(() =>
    timeOffRequestNotifications.value.map(buildTimeOffRequestRow),
);

const messageNotificationRows = computed<MessageNotificationRow[]>(() =>
    messageNotifications.value.map(buildMessageNotificationRow),
);

const shiftOfferRequestColumns: TableColumn<ShiftOfferRequestRow>[] = [
    { accessorKey: "employeeName", header: "Employee" },
    { accessorKey: "shiftStartTime", header: "Shift Start" },
    { accessorKey: "shiftEndTime", header: "Shift End" },
    { accessorKey: "offerMessage", header: "Offer Message" },
    { id: "actions", meta: { class: { td: "text-right" } } },
];

const shiftTradeRequestColumns: TableColumn<ShiftTradeRequestRow>[] = [
    { accessorKey: "requestingEmployeeName", header: "Employee" },
    { accessorKey: "targetEmployeeName", header: "Target Employee" },
    { accessorKey: "tradeMessage", header: "Trade Message" },
    { id: "actions", meta: { class: { td: "text-right" } } },
];

const timeOffRequestColumns: TableColumn<TimeOffRequestRow>[] = [
    { accessorKey: "employeeName", header: "Employee" },
    { accessorKey: "timeOffStartDate", header: "Start" },
    { accessorKey: "timeOffEndDate", header: "End" },
    { accessorKey: "reasonMessage", header: "Reason" },
    { id: "actions", meta: { class: { td: "text-right" } } },
];

const messageNotificationColumns: TableColumn<MessageNotificationRow>[] = [
    { accessorKey: "messageType", header: "Type" },
    { accessorKey: "messageContent", header: "Message" },
    { id: "actions", meta: { class: { td: "text-right" } } },
];

async function approveShiftOfferRequest(shiftOfferRow: ShiftOfferRequestRow) {
    try {
        await ShiftOfferRequestNotificationServices.approve(
            shiftOfferRow.notification.shiftOfferRequestNotification!,
        );
        removeNotificationFromList(
            shiftOfferRequestNotifications,
            shiftOfferRow.notification.id,
        );
        showSuccessToast(
            `${shiftOfferRow.employeeName}'s shift offer approved.`,
        );
    } catch {
        showErrorToast();
    }
}

async function denyShiftOfferRequest(shiftOfferRow: ShiftOfferRequestRow) {
    try {
        await ShiftOfferRequestNotificationServices.deny(
            shiftOfferRow.notification.shiftOfferRequestNotification!,
        );
        removeNotificationFromList(
            shiftOfferRequestNotifications,
            shiftOfferRow.notification.id,
        );
        showDeniedToast(`${shiftOfferRow.employeeName}'s shift offer denied.`);
    } catch {
        showErrorToast();
    }
}

async function approveShiftTradeRequest(shiftTradeRow: ShiftTradeRequestRow) {
    try {
        await ShiftTradeRequestNotificationServices.approve(
            shiftTradeRow.notification.shiftTradeRequestNotification!,
        );
        removeNotificationFromList(
            shiftTradeRequestNotifications,
            shiftTradeRow.notification.id,
        );
        showSuccessToast(
            `${shiftTradeRow.requestingEmployeeName}'s trade request approved.`,
        );
    } catch {
        showErrorToast();
    }
}

async function denyShiftTradeRequest(shiftTradeRow: ShiftTradeRequestRow) {
    try {
        await ShiftTradeRequestNotificationServices.deny(
            shiftTradeRow.notification.shiftTradeRequestNotification!,
        );
        removeNotificationFromList(
            shiftTradeRequestNotifications,
            shiftTradeRow.notification.id,
        );
        showDeniedToast(
            `${shiftTradeRow.requestingEmployeeName}'s trade request denied.`,
        );
    } catch {
        showErrorToast();
    }
}

async function approveTimeOffRequest(timeOffRow: TimeOffRequestRow) {
    try {
        await TimeOffRequestNotificationServices.approve(
            timeOffRow.notification.timeOffRequestNotification!,
        );
        removeNotificationFromList(
            timeOffRequestNotifications,
            timeOffRow.notification.id,
        );
        showSuccessToast(`${timeOffRow.employeeName}'s time off approved.`);
    } catch {
        showErrorToast();
    }
}

async function denyTimeOffRequest(timeOffRow: TimeOffRequestRow) {
    try {
        await TimeOffRequestNotificationServices.deny(
            timeOffRow.notification.timeOffRequestNotification!,
        );
        removeNotificationFromList(
            timeOffRequestNotifications,
            timeOffRow.notification.id,
        );
        showDeniedToast(`${timeOffRow.employeeName}'s time off denied.`);
    } catch {
        showErrorToast();
    }
}

async function dismissMessageNotification(messageRow: MessageNotificationRow) {
    try {
        await MessageNotificationServices.delete(
            messageRow.notification.messageNotification!,
        );
        removeNotificationFromList(
            messageNotifications,
            messageRow.notification.id,
        );
        toast.add({
            title: "Dismissed",
            description: "Message dismissed.",
            icon: "i-lucide-check",
        });
    } catch {
        showErrorToast();
    }
}

onMounted(async () => {
    shiftOfferRequestNotifications.value =
        await ShiftOfferRequestNotificationServices.getAllForBusiness();
    shiftTradeRequestNotifications.value =
        await ShiftTradeRequestNotificationServices.getAllForBusiness();
    timeOffRequestNotifications.value =
        await TimeOffRequestNotificationServices.getAllForBusiness();
    messageNotifications.value =
        await MessageNotificationServices.getAllForBusiness();
});
</script>

<template>
    <div class="grid grid-cols-2 gap-6 h-full overflow-y-auto">
        <UCard :ui="{ header: 'font-semibold text-black' }">
            <template #header>Shift Offer Requests</template>
            <UTable
                :columns="shiftOfferRequestColumns"
                :data="shiftOfferRequestRows"
            >
                <template #actions-cell="{ row }">
                    <div class="flex justify-end gap-2">
                        <UButton
                            color="red"
                            variant="soft"
                            size="sm"
                            @click="denyShiftOfferRequest(row.original)"
                            >Deny</UButton
                        >
                        <UButton
                            color="primary"
                            size="sm"
                            @click="approveShiftOfferRequest(row.original)"
                            >Approve</UButton
                        >
                    </div>
                </template>
            </UTable>
        </UCard>

        <UCard class="min-w-0" :ui="{ header: 'font-semibold text-black' }">
            <template #header>Shift Trade Requests</template>
            <UTable
                class="w-full table-fixed"
                :columns="shiftTradeRequestColumns"
                :data="shiftTradeRequestRows"
            >
                <template #actions-cell="{ row }">
                    <div class="flex justify-end gap-2">
                        <UButton
                            color="red"
                            variant="soft"
                            size="sm"
                            @click="denyShiftTradeRequest(row.original)"
                            >Deny</UButton
                        >
                        <UButton
                            color="primary"
                            size="sm"
                            @click="approveShiftTradeRequest(row.original)"
                            >Approve</UButton
                        >
                    </div>
                </template>
            </UTable>
        </UCard>

        <UCard :ui="{ header: 'font-semibold text-black' }">
            <template #header>Time Off Requests</template>
            <UTable :columns="timeOffRequestColumns" :data="timeOffRequestRows">
                <template #actions-cell="{ row }">
                    <div class="flex justify-end gap-2">
                        <UButton
                            color="red"
                            variant="soft"
                            size="sm"
                            @click="denyTimeOffRequest(row.original)"
                            >Deny</UButton
                        >
                        <UButton
                            color="primary"
                            size="sm"
                            @click="approveTimeOffRequest(row.original)"
                            >Approve</UButton
                        >
                    </div>
                </template>
            </UTable>
        </UCard>

        <UCard :ui="{ header: 'font-semibold text-black' }">
            <template #header>Messages</template>
            <UTable
                :columns="messageNotificationColumns"
                :data="messageNotificationRows"
            >
                <template #actions-cell="{ row }">
                    <div class="flex justify-end">
                        <UButton
                            color="red"
                            variant="soft"
                            size="sm"
                            @click="dismissMessageNotification(row.original)"
                            >Delete</UButton
                        >
                    </div>
                </template>
            </UTable>
        </UCard>
    </div>
</template>
