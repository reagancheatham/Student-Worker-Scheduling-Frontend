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

    //TODO: rag said this is fixed in most recent version. Need to refactor to use standard.

    //since the getAll was throwing an error, i had AI build this to avoid modifying high traffic code...
    //We can come back and modify the original function but this is the fix for now
    //databaseServices getAll assumed that results.data is an array and threw a type error, i dont fully understand the issue
    private static async fetchArray<T>(
        model: DatabaseModelStatic<T>,
        path: string,
    ): Promise<T[]> {
        const response = await apiClient.get(path);
        console.log(`Raw response for ${path}:`, response.data);
        let data = response.data;

        // The backend wraps arrays in { results: [...] }
        if (data && typeof data === "object" && Array.isArray(data.results)) {
            data = data.results;
        } else if (!Array.isArray(data)) {
            // Fallback: if it's a single object, wrap it
            data = [data];
        }

        const result = data.map((item: object) => model.create(item));
        return result;
    }

    static async getAllAvailableTradeRequests(businessID: number) {
        return await this.fetchArray<ShiftTradeRequest>(
            ShiftTradeRequest,
            `${TRADE_API_ROOT}/available/${businessID}`,
        );
    }

    static async getAllPendingTradeRequests(businessID: number) {
        return await this.fetchArray<ShiftTradeRequest>(
            ShiftTradeRequest,
            `${TRADE_API_ROOT}/pending/${businessID}`,
        );
    }

    static async getAllAvailableOfferedShifts(businessID: number) {
        return this.fetchArray<ShiftOfferRequest>(
            ShiftOfferRequest,
            `${OFFER_API_ROOT}/available/${businessID}`,
        );
    }

    static async getAllPendingOfferedShifts(businessID: number) {
        return this.fetchArray<ShiftOfferRequest>(
            ShiftOfferRequest,
            `${OFFER_API_ROOT}/pending/${businessID}`,
        );
    }
}
