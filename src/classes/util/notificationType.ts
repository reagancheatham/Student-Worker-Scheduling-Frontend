export const NotificationType = {
    TimeOffRequest: "Time Off Request",
    ShiftOfferRequest: "Shift Offer Request",
    ShiftTradeRequest: "Shift Trade Request",
} as const

export type NotificationType = (typeof NotificationType)[keyof typeof NotificationType];