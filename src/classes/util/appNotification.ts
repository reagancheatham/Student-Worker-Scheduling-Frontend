import { NotificationType } from "@classes/util/notificationType.ts";
import { MessageNotification } from "@classes/database/notifications/messageNotification.ts";
import { ShiftOfferRequestNotification } from "@classes/database/notifications/shiftOfferRequestNotification.ts";
import { ShiftTradeRequestNotification } from "@classes/database/notifications/shiftTradeRequestNotification.ts";
import { TimeOffRequestNotification } from "@classes/database/notifications/timeOffRequestNotification.ts";

export class AppNotification {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly description: string,
        public readonly notificationType: NotificationType,
        public readonly dismissed: boolean,
        public readonly createdAt: Date,
        public readonly messageNotification?: InstanceType<
            typeof MessageNotification
        >,
        public readonly shiftOfferRequestNotification?: InstanceType<
            typeof ShiftOfferRequestNotification
        >,
        public readonly shiftTradeRequestNotification?: InstanceType<
            typeof ShiftTradeRequestNotification
        >,
        public readonly timeOffRequestNotification?: InstanceType<
            typeof TimeOffRequestNotification
        >,
        public readonly avatar?: string,
    ) {}

    private static formatDate(date: Date): string {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(new Date(date));
    }

    public static sortByDate(
        notifications: AppNotification[],
    ): AppNotification[] {
        return [...notifications].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        );
    }

    public static fromMessage(
        messageNotification: MessageNotification,
    ): AppNotification {
        return new AppNotification(
            messageNotification.id,
            "Message",
            messageNotification.message,
            messageNotification.notificationType,
            messageNotification.dismissed,
            messageNotification.createdAt,
            messageNotification,
        );
    }

    public static fromShiftOfferRequest(
        shiftOfferRequestNotification: ShiftOfferRequestNotification,
    ): AppNotification {
        const { shift } =
            shiftOfferRequestNotification.shiftOfferRequest;
        return new AppNotification(
            shiftOfferRequestNotification.id,
            shift.employee?.fullName ?? "Unknown Employee",
            `${shift.employee?.fullName ?? "Unknown"} wishes to offer their shift at ${shift?.startTimeFormatted ?? "unknown time"}`,
            shiftOfferRequestNotification.notificationType,
            shiftOfferRequestNotification.dismissed,
            shiftOfferRequestNotification.createdAt,
            undefined,
            shiftOfferRequestNotification as ShiftOfferRequestNotification,
        );
    }
 
    public static fromShiftTradeRequest(
        shiftTradeRequestNotification: ShiftTradeRequestNotification,
    ): AppNotification {
        const { employee, targetEmployee, shift } =
            shiftTradeRequestNotification.shiftTradeRequest;
        const name =
            employee?.fullName ??
            shift?.employee?.fullName ??
            "Unknown Employee";
        const target = targetEmployee?.fullName ?? "Unknown Employee";
        const time = shift?.startTimeFormatted ?? "unknown time";
        return new AppNotification(
            shiftTradeRequestNotification.id,
            name,
            `${name} wishes to trade their shift at ${time} with ${target}`,
            shiftTradeRequestNotification.notificationType,
            shiftTradeRequestNotification.dismissed,
            shiftTradeRequestNotification.createdAt,
            undefined,
            undefined,
            shiftTradeRequestNotification,
        );
    }

    public static fromTimeOffRequest(
        timeOffRequestNotification: TimeOffRequestNotification,
    ): AppNotification {
        const { employee, startDate, endDate } =
            timeOffRequestNotification.timeOffRequest;
        return new AppNotification(
            timeOffRequestNotification.id,
            employee.fullName,
            `Requesting time off from ${AppNotification.formatDate(startDate)} to ${AppNotification.formatDate(endDate)}`,
            timeOffRequestNotification.notificationType,
            timeOffRequestNotification.dismissed,
            timeOffRequestNotification.createdAt,
            undefined,
            undefined,
            undefined,
            timeOffRequestNotification,
        );
    }
}
