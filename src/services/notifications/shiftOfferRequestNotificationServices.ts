import { ShiftOfferRequestNotification } from "@classes/database/notifications/shiftOfferRequestNotification";
import { DatabaseServices } from "@classes/util/databaseServices";
import { Store } from "@classes/util/store/store";
import { AppNotification } from "@classes/util/appNotification";
import { apiClient } from "../services";
import { ShiftOfferRequestServices } from "../shiftOfferRequestServices";

const API_ROOT: string = "shiftOfferRequestNotifications";

export class ShiftOfferRequestNotificationServices {
    static async update(
        shiftOfferRequestNotification: ShiftOfferRequestNotification,
    ) {
        await DatabaseServices.update(
            ShiftOfferRequestNotification,
            API_ROOT,
            shiftOfferRequestNotification,
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
                        ShiftOfferRequestNotification.createFromData(item);
                    return AppNotification.fromShiftOfferRequest(
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

    static async dismiss(
        shiftOfferRequestNotification: ShiftOfferRequestNotification,
    ) {
        await apiClient.put(`${API_ROOT}/dismiss`, {
            id: shiftOfferRequestNotification.id,
        });
    }

    static async approve(
        shiftOfferRequestNotification: ShiftOfferRequestNotification,
    ) {
        ShiftOfferRequestServices.approve(
            shiftOfferRequestNotification.shiftOfferRequest,
        );
    }

    static async deny(
        shiftOfferRequestNotification: ShiftOfferRequestNotification,
    ) {
        ShiftOfferRequestServices.deny(
            shiftOfferRequestNotification.shiftOfferRequest,
        );
    }
}
