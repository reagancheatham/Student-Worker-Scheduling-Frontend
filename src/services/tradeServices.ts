import { DatabaseServices } from "@classes/util/databaseServices";
import { ShiftOfferRequest } from "@classes/database/shiftOfferRequests";
import { ShiftTradeRequest } from "@classes/database/shiftTradeRequests";
import { apiClient } from "./services";
import { DatabaseModelStatic } from "@classes/database/databaseModel";

const TRADE_API_ROOT: string = "shiftTradeRequests";
const OFFER_API_ROOT: string = "shiftOfferRequests";

// Putting both trades and offers in one service,
export class TradeServices {
    /* OFFERS */
    static async createOfferedShift(offer: ShiftOfferRequest) {
        await DatabaseServices.create(ShiftOfferRequest, OFFER_API_ROOT, offer);
    }

    static async updateOfferedShift(offer: ShiftOfferRequest) {
        await DatabaseServices.update(ShiftOfferRequest, OFFER_API_ROOT, offer);
    }

    static async deleteOfferedShift(offer: ShiftOfferRequest) {
        await DatabaseServices.delete(`${OFFER_API_ROOT}/${offer.id}`);
    }

    /* TRADES */
    static async createTradeRequest(trade: ShiftTradeRequest) {
        await DatabaseServices.create(ShiftTradeRequest, TRADE_API_ROOT, trade);
    }

    static async updateTradeRequest(trade: ShiftTradeRequest) {
        await DatabaseServices.update(ShiftOfferRequest, TRADE_API_ROOT, trade);
    }

    static async deleteTradeRequest(trade: ShiftTradeRequest) {
        await DatabaseServices.delete(`${TRADE_API_ROOT}/${trade.id}`);
    }

    /* GETS */
    static async getOfferedShift(id: number) {
        return await DatabaseServices.get<ShiftOfferRequest>(
            ShiftOfferRequest,
            `${OFFER_API_ROOT}/${id}`,
        );
    }

    static async getTradeRequest(id: number) {
        return await DatabaseServices.get<ShiftTradeRequest>(
            ShiftTradeRequest,
            `${TRADE_API_ROOT}/${id}`,
        );
    }

    static async getAllAvailableTradeRequests(businessID: number) {
        return await DatabaseServices.getAll<ShiftTradeRequest>(
            ShiftTradeRequest,
            `${TRADE_API_ROOT}/available/${businessID}`,
        );
    }

    static async getAllPendingTradeRequests(businessID: number) {
        return await DatabaseServices.getAll<ShiftTradeRequest>(
            ShiftTradeRequest,
            `${TRADE_API_ROOT}/pending/${businessID}`,
        );
    }

    static async getAllAvailableOfferedShifts(businessID: number) {
        return DatabaseServices.getAll<ShiftOfferRequest>(
            ShiftOfferRequest,
            `${OFFER_API_ROOT}/available/${businessID}`,
        );
    }

    static async getAllPendingOfferedShifts(businessID: number) {
        return await DatabaseServices.getAll<ShiftOfferRequest>(
            ShiftOfferRequest,
            `${OFFER_API_ROOT}/pending/${businessID}`,
        );
    }
}
