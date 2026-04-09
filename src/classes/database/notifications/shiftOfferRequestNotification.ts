import { NotificationType } from "@classes/util/notificationType.ts";
import { DatabaseModel } from "../databaseModel.ts";
import { ShiftOfferRequest } from "../shiftOfferRequest.ts";

export class ShiftOfferRequestNotification extends DatabaseModel{

    constructor(
        public readonly id: number,
        public readonly shiftOfferRequest: ShiftOfferRequest,
        public readonly notificationType: NotificationType,
        public readonly dismissed: boolean,
        public readonly createdAt: Date,
    ) {
        super();
    }

    public static createFromData(data: any): ShiftOfferRequestNotification {
            return new ShiftOfferRequestNotification(
                data["id"] ?? 0,
                data["shiftOfferRequest"] ?? "",
                NotificationType.ShiftOfferRequest,
                data["dismissed"] ?? 0,
                data["createdAt"] ?? Date.now()
            );
        }
}
