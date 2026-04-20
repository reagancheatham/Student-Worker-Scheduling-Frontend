import { MessageNotification } from "@classes/database/notifications/messageNotification";
import { AppNotification } from "@classes/util/appNotification";
import { DatabaseServices } from "@classes/util/databaseServices";
import { Store } from "@classes/util/store.ts";
import { apiClient } from "../services";

const API_ROOT: string = "messageNotifications";

export class MessageNotificationServices {
    static async update(messageNotification: MessageNotification) {
        await DatabaseServices.update(MessageNotification, API_ROOT, messageNotification);
    }

    static async getAllForBusiness(): Promise<AppNotification[]> {
        const business = await Store.getBusiness();
        const path = `${API_ROOT}/business/${business?.id}`;
        let finalResult: AppNotification[] = [];

        try {
            const response = await apiClient.get(path);
            const data = response.data;

            if (Array.isArray(data)) {
                finalResult = data.map((item: any) => {
                    const notificationInstance =
                        MessageNotification.createFromData(item);
                    return AppNotification.fromMessage(
                        notificationInstance,
                    );
                });
            }
            console.log(`${path} found successfully`);
        } catch (error: any) {
            console.error(`Error fetching from ${path}: ${error.message}`);
            return [];
        }

        return finalResult;
    }
}
