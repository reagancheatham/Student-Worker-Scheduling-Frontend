<script setup lang="ts">
import { onMounted, ref } from "vue";
import { AppNotification } from "@classes/util/appNotification";
import { ShiftOfferRequestNotificationServices } from "../../services/notifications/shiftOfferRequestNotificationServices";
import { TimeOffRequestNotificationServices } from "../../services/notifications/timeOffRequestNotificationServices";
import { NotificationType } from "@classes/util/notificationType";
import { MessageNotificationServices } from "../../services/notifications/messageNotificationServices";
import { ShiftTradeRequestNotificationServices } from "../../services/notifications/shfitTradeRequestNotificationServices";

const notifications = ref<AppNotification[]>([]);
const toast = useToast();

async function getNotifications() {
    const timeOffRequests = await TimeOffRequestNotificationServices.getAllForBusiness();
    const shiftOfferRequests = await ShiftOfferRequestNotificationServices.getAllForBusiness();
    const messages = await MessageNotificationServices.getAllForBusiness()
    const shiftTradeRequests = await ShiftTradeRequestNotificationServices.getAllForBusiness();
    notifications.value = AppNotification.sortByDate([
        ...timeOffRequests,
        ...shiftOfferRequests,
        ...messages,
        ...shiftTradeRequests,
    ]);
}

function getAvatar(notification: AppNotification) {
    return {
        src: notification.avatar ?? undefined,
        icon: notification.avatar ? undefined : notificationIcon(notification.notificationType),
    };
}

function notificationIcon(type: NotificationType): string {
    switch (type) {
        case NotificationType.Alert:   return "i-lucide-triangle-alert";
        case NotificationType.Warning: return "i-lucide-circle-alert";
        case NotificationType.Message: return "i-lucide-message-circle";
        case NotificationType.TimeOffRequest:    return "i-lucide-calendar-off";
        case NotificationType.ShiftOfferRequest: return "i-lucide-hand-helping";
        case NotificationType.ShiftTradeRequest: return "i-lucide-arrow-left-right";
        default: return "i-lucide-bell";
    }
}

function notificationColor(type: NotificationType): string {
    switch (type) {
        case NotificationType.Alert:   return "text-red-500";
        case NotificationType.Warning: return "text-yellow-500";
        default: return "text-gray-500";
    }
}

function formatTime(date: Date): string {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(new Date(date));
}

function isActionable(type: NotificationType): boolean {
    return [
        NotificationType.TimeOffRequest,
        NotificationType.ShiftOfferRequest,
        NotificationType.ShiftTradeRequest,
    ].includes(type as any);
}

async function dismiss(notification: AppNotification, close: () => void) {
    notifications.value = notifications.value.filter(n => n.id !== notification.id);
    close();
}

async function deny(notification: AppNotification, close: () => void) {
    try {
        switch (notification.notificationType) {
            case NotificationType.TimeOffRequest:
                await TimeOffRequestNotificationServices.deny(notification.timeOffRequestNotification!);
                break;
            case NotificationType.ShiftOfferRequest:
                await ShiftOfferRequestNotificationServices.deny(notification.shiftOfferRequestNotification!);
                break;
            case NotificationType.ShiftTradeRequest:
                await ShiftTradeRequestNotificationServices.deny(notification.shiftTradeRequestNotification!);
                break;
        }
        notifications.value = notifications.value.filter(n => n.id !== notification.id);
        await getNotifications();
        toast.add({
            title: "Request Denied",
            description: `${notification.name}'s request has been denied.`,
            color: "red",
            icon: "i-lucide-x-circle",
        });
    } catch (e) {
        toast.add({
            title: "Error",
            description: "Something went wrong. Please try again.",
            color: "red",
            icon: "i-lucide-triangle-alert",
        });
    }
    close();
}

async function approve(notification: AppNotification, close: () => void) {
    try {
        switch (notification.notificationType) {
            case NotificationType.TimeOffRequest:
                await TimeOffRequestNotificationServices.approve(notification.timeOffRequestNotification!);
                break;
            case NotificationType.ShiftOfferRequest:
                await ShiftOfferRequestNotificationServices.approve(notification.shiftOfferRequestNotification!);
                break;
            case NotificationType.ShiftTradeRequest:
                await ShiftTradeRequestNotificationServices.approve(notification.shiftTradeRequestNotification!);
                break;
        }
        notifications.value = notifications.value.filter(n => n.id !== notification.id);
        await getNotifications();
        toast.add({
            title: "Request Denied",
            description: `${notification.name}'s request has been approved.`,
            color: "red",
            icon: "i-lucide-x-circle",
        });
    } catch (e) {
        toast.add({
            title: "Error",
            description: "Something went wrong. Please try again.",
            color: "red",
            icon: "i-lucide-triangle-alert",
        });
    }
    close();
}

onMounted(() => {
    getNotifications();
});
</script>

<template>
    <UCard
        :ui="{
            header: 'font-semibold text-black shrink-0',
            body: '!px-0 !pt-0 !pb-3 flex-1 overflow-y-auto min-h-0',
        }"
    >
        <template #header>
            <span>Notifications</span>
        </template>

        <UPageList>
            <UPageCard
                variant="ghost"
                v-for="(notification, index) in notifications"
                :key="index"
            >
                <template #body>
                    <UPopover
                        :content="{
                            align: 'center',
                            side: 'left',
                            sideOffset: 24,
                        }"
                    >
                        <UUser
                            :name="notification.name"
                            :description="notification.notificationType"
                            :avatar="getAvatar(notification as any)"
                            :ui="{
                                root: 'hover:bg-gray-50 rounded-md cursor-pointer transition-colors duration-150 px-2 py-1',
                                description: notificationColor(notification.notificationType),
                            }"
                        />
                        <template #content="{ close }">
                            <UCard class="w-80 flex flex-col gap-4 shadow-lg">
                                <div class="flex justify-between items-center">
                                    <UUser
                                        :name="notification.name"
                                        :description="notification.notificationType"
                                        :avatar="getAvatar(notification as any)"
                                        :ui="{
                                            root: 'p-0',
                                            description: notificationColor(notification.notificationType),
                                        }"
                                    />
                                    <UButton
                                        color="neutral"
                                        variant="ghost"
                                        icon="i-lucide-x"
                                        size="sm"
                                        @click="close"
                                    />
                                </div>
                                <p class="text-xs text-gray-400">
                                    {{ formatTime(notification.createdAt) }}
                                </p>
                                <p class="text-sm text-gray-600">
                                    {{ notification.description }}
                                </p>
                                <div class="flex justify-between items-center pt-1">
                                    <UButton
                                        color="neutral"
                                        variant="ghost"
                                        size="sm"
                                        @click="dismiss(notification as any, close)"
                                    >
                                        Dismiss
                                    </UButton>
                                    <div v-if="isActionable(notification.notificationType)" class="flex gap-2">
                                        <UButton
                                            color="red"
                                            variant="soft"
                                            size="sm"
                                            @click="deny(notification as any, close)"
                                        >
                                            Deny
                                        </UButton>
                                        <UButton
                                            color="primary"
                                            size="sm"
                                            @click="approve(notification as any, close)"
                                        >
                                            Approve
                                        </UButton>
                                    </div>
                                </div>

                            </UCard>
                        </template>
                    </UPopover>
                </template>
            </UPageCard>
        </UPageList>
    </UCard>
</template>