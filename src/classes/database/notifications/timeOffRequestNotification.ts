import { NotificationType } from "@classes/util/notificationType.ts";
import { DatabaseModel } from "../databaseModel.ts";
import { TimeOffRequest } from "../timeOffRequest.ts";

export class TimeOffRequestNotification extends DatabaseModel{

    constructor(
        public readonly id: number,
        public readonly timeOffRequest: TimeOffRequest,
        public readonly notificationType: NotificationType,
        public readonly dismissed: boolean,
        public readonly createdAt: Date,
    ) {
        super();
    }

    public static createFromData(data: any): TimeOffRequestNotification {
            return new TimeOffRequestNotification(
                data["id"] ?? 0,
                data["timeOffRequest"] ?? "",
                NotificationType.TimeOffRequest,
                data["dismissed"] ?? 0,
                data["createdAt"] ?? Date.now()
            );
        }
}
