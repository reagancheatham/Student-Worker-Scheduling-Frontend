import { NotificationType } from "@classes/util/notificationType.ts";
import { DatabaseModel } from "../databaseModel.ts";

export class MessageNotification extends DatabaseModel{

    constructor(
        public readonly id: number,
        public readonly message: string,
        public readonly notificationType: NotificationType,
        public readonly dismissed: boolean,
        public readonly createdAt: Date,
    ) {
        super();
    }

    public static createFromData(data: any): MessageNotification {
            return new MessageNotification(
                data["id"] ?? 0,
                data["message"] ?? "",
                data["notificationType"] ?? NotificationType.Message,
                data["dismissed"] ?? 0,
                data["createdAt"] ?? Date.now()
            );
        }
}
