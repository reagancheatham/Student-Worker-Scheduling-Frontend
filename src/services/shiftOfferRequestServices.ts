import { Business } from "@classes/database/business";
import { ApprovalStatus } from "@classes/util/approvalStatus";
import { DatabaseServices } from "@classes/util/databaseServices";
import { ShiftOfferRequest } from "@classes/database/shiftOfferRequest";
import { apiClient } from "./services";
import { Store } from "@classes/util/store/store";
import { Shift } from "@classes/database/shift";

const API_ROOT: string = "shiftOfferRequests";

export class ShiftOfferRequestServices {
    static async create(shiftOfferRequest: ShiftOfferRequest) {
        await DatabaseServices.create(
            ShiftOfferRequest,
            API_ROOT,
            shiftOfferRequest,
        );
    }

    static async update(shiftOfferRequest: ShiftOfferRequest) {
        await DatabaseServices.update(
            ShiftOfferRequest,
            API_ROOT,
            shiftOfferRequest,
        );
    }

    static async delete(shiftOfferRequest: ShiftOfferRequest) {
        await DatabaseServices.delete(`${API_ROOT}/${shiftOfferRequest.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<ShiftOfferRequest>(
            ShiftOfferRequest,
            `${API_ROOT}/${id}`,
        );
    }

    static async getAllAcceptedRequestsForBusiness() {
        const business = await Store.businessStore.get();
        if (!business) return [];
        return await DatabaseServices.getAll<ShiftOfferRequest>(
            ShiftOfferRequest,
            `${API_ROOT}/accepted/${business.id}`,
        );
    }

    static async approve(shiftOfferRequest: ShiftOfferRequest) {
        await apiClient.put(`${API_ROOT}/approve`, {
            id: shiftOfferRequest.id,
        });
    }

    static async deny(shiftOfferRequest: ShiftOfferRequest) {
        return await apiClient.put(`${API_ROOT}/deny`, {
            id: shiftOfferRequest.id,
        });
    }

    static async getAllForBusiness(business: Business) {
        return await DatabaseServices.getAll<ShiftOfferRequest>(
            ShiftOfferRequest,
            `${API_ROOT}/business/${business.id}`,
        );
    }
}
