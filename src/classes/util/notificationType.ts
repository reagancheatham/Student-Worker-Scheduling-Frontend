export const NotificationType = {
    TimeOffRequest: "TimeOffRequest",
    ShiftOfferRequest: "ShiftOfferRequest",
    ShiftTradeRequest: "ShiftTradeRequest",
} as const

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];