import { NotificationType } from "@classes/util/notificationType.ts";
import { DatabaseModel } from "../databaseModel.ts";
import { ShiftTradeRequest } from "../shiftTradeRequest.ts";

export class ShiftTradeRequestNotification extends DatabaseModel{

    constructor(
        public readonly id: number,
        public readonly shiftTradeRequest: ShiftTradeRequest,
        public readonly notificationType: NotificationType,
        public readonly dismissed: boolean,
        public readonly createdAt: Date,
    ) {
        super();
    }

    public static createFromData(data: any): ShiftTradeRequestNotification {
            return new ShiftTradeRequestNotification(
                data["id"] ?? 0,
                data["shiftTradeRequest"] ?? "",
                NotificationType.ShiftTradeRequest,
                data["dismissed"] ?? 0,
                data["createdAt"] ?? Date.now()
            );
        }
}
