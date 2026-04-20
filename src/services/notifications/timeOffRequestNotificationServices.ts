import { TimeOffRequestNotification } from "@classes/database/notifications/timeOffRequestNotification";
import { AppNotification } from "@classes/util/appNotification";
import { DatabaseServices } from "@classes/util/databaseServices";
import { Store } from "@classes/util/store.ts";
import { apiClient } from "../services";
import { TimeOffRequestServices } from "../timeOffServices";

const API_ROOT: string = "timeOffRequestNotifications";

export class TimeOffRequestNotificationServices {
    static async update(
        timeOffRequestNotification: TimeOffRequestNotification,
    ) {
        await DatabaseServices.update(
            TimeOffRequestNotification,
            API_ROOT,
            timeOffRequestNotification,
        );
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
                        TimeOffRequestNotification.createFromData(item);
                    return AppNotification.fromTimeOffRequest(
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

    static async approve(
        timeOffRequestNotification: TimeOffRequestNotification,
    ) {
        TimeOffRequestServices.approve(
            timeOffRequestNotification.timeOffRequest,
        );
    }

    static async deny(
        timeOffRequestNotification: TimeOffRequestNotification,
    ) {
        TimeOffRequestServices.deny(
            timeOffRequestNotification.timeOffRequest,
        );
    }
}
