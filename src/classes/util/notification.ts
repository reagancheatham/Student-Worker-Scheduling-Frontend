import { description } from "valibot";
import { NotificationType } from "./notificationType";

export class Notification {
  constructor(
    public readonly user: string,
    public readonly description: string,
    public readonly avatar: string,
    public readonly notificationType: NotificationType,
  ) {}
}
