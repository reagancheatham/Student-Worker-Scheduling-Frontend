<script setup lang="ts">
import { onMounted, ref } from "vue";
import { TimeOffRequestServices } from "../../services/timeOffServices";
import { Notification, NotificationModel } from "@classes/util/notification";
import { NotificationType } from "@classes/util/notificationType";
import { Store } from "@classes/util/store.ts";

const notifications = ref<Notification<NotificationModel>[]>([]);

//this function will more likely than not just service call each type of notification backend model, unify them, then put em in an array of notification classes
async function getNotifications() {
    const business = await Store.getBusiness();

    if (!business) {
        notifications.value = [];
        return;
    }
    
    const businessID = business.id;

    const timeOffRequests = await TimeOffRequestServices.getAllForBusiness(
        Number(businessID),
    );

    notifications.value = timeOffRequests.map((timeOffRequest) => {
        return new Notification(
            timeOffRequest.employee.fullName,
            timeOffRequest.reason,
            {},
            NotificationType.TimeOffRequest,
            timeOffRequest,
        );
    });
}

async function deny(notification: Notification<NotificationModel>) {
    switch (notification.notificationType) {
        case NotificationType.TimeOffRequest:
            await TimeOffRequestServices.deny(notification.model);
            break;
    }
}

async function approve(notification: Notification<NotificationModel>) {
    switch (notification.notificationType) {
        case NotificationType.TimeOffRequest:
            await TimeOffRequestServices.deny(notification.model);
            break;
    }
}

onMounted(() => {
    getNotifications();
});
</script>

<template>
    <UCard
        :ui="{
            header: 'font-semibold text-black shrink-0',
            body: 'px-0! pt-0! pb-3! flex-1 overflow-y-auto min-h-0',
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
                            :name="notification.user"
                            :description="notification.notificationType"
                            :avatar="notification.avatar"
                            :ui="{
                                root: 'hover:bg-gray-50 rounded-md cursor-pointer transition-colors duration-150',
                            }"
                            @click="console.log()"
                        />
                        <template #content="{ close }">
                            <UCard class="w-80 flex flex-col gap-3 shadow-lg">
                                <div class="flex justify-between items-center">
                                    <UUser
                                        :name="notification.user"
                                        :description="
                                            notification.notificationType
                                        "
                                        :avatar="notification.avatar"
                                        :ui="{ root: 'p-0' }"
                                    />
                                    <UButton
                                        color="neutral"
                                        variant="ghost"
                                        icon="i-lucide-x"
                                        size="sm"
                                        @click="close"
                                    />
                                </div>

                                <p>
                                    {{ notification.description }}
                                </p>

                                <div class="flex justify-end gap-2 pt-2">
                                    <UButton
                                        color="red"
                                        @click="deny(notification)"
                                    >
                                        Deny
                                    </UButton>
                                    <UButton
                                        color="var(--ui-primary)"
                                        @click="approve(notification)"
                                    >
                                        Approve
                                    </UButton>
                                </div>
                            </UCard>
                        </template>
                    </UPopover>
                </template>
            </UPageCard>
        </UPageList>
    </UCard>
</template>
