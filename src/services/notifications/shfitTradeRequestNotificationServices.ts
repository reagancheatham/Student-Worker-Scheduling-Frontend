import { ShiftTradeRequestNotification } from "@classes/database/notifications/shiftTradeRequestNotification.ts";
import { AppNotification } from "@classes/util/appNotification";
import { DatabaseServices } from "@classes/util/databaseServices";
import { Store } from "@classes/util/store/store";
import { apiClient } from "../services";
import { ShiftTradeRequestServices } from "../shiftTradeRequestServices";

const API_ROOT: string = "shiftTradeRequestNotifications";

export class ShiftTradeRequestNotificationServices {
    static async update(
        shiftTradeRequestNotification: ShiftTradeRequestNotification,
    ) {
        await DatabaseServices.update(
            ShiftTradeRequestNotification,
            API_ROOT,
            shiftTradeRequestNotification,
        );
    }

    static async getAllForBusiness(): Promise<AppNotification[]> {
        const business = await Store.businessStore.get();
        const path = `${API_ROOT}/business/${business?.id}`;
        let finalResult: AppNotification[] = [];

        try {
            const response = await apiClient.get(path);
            const data = response.data;

            if (Array.isArray(data)) {
                finalResult = data.map((item: any) => {
                    const notificationInstance =
                        ShiftTradeRequestNotification.createFromData(item);
                    return AppNotification.fromShiftTradeRequest(
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

    static async dismiss(shiftTradeRequestNotification: ShiftTradeRequestNotification) {
        await apiClient.put(`${API_ROOT}/dismiss`, {
            id: shiftTradeRequestNotification.id,
        });
    }

    static async approve(
        shiftTradeRequestNotification: ShiftTradeRequestNotification,
    ) {
        ShiftTradeRequestServices.approve(
            shiftTradeRequestNotification.shiftTradeRequest,
        );
    }

    static async deny(
        timeOffRequestNotification: ShiftTradeRequestNotification,
    ) {
        ShiftTradeRequestServices.deny(
            timeOffRequestNotification.shiftTradeRequest,
        );
    }
}
