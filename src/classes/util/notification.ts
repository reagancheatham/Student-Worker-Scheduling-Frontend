import { description } from "valibot";
import { NotificationType } from "./notificationType";
import { TimeOffRequest } from "@classes/database/timeOffRequest";

export class Notification<Model> {
  constructor(
    public readonly user: string,
    public readonly description: string,
    public readonly avatar: { src?: string; alt?: string; icon?: string },
    public readonly notificationType: NotificationType,
    public readonly model: Model,
  ) {}
}

export type NotificationModel = TimeOffRequest; //add others later
