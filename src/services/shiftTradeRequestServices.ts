import { Business } from "@classes/database/business";
import { DatabaseServices } from "@classes/util/databaseServices";
import { ShiftTradeRequest } from "@classes/database/shiftTradeRequest";
import { apiClient } from "./services";
import { Employee } from "@classes/database/employee";

const API_ROOT: string = "shiftTradeRequests";

export class ShiftTradeRequestServices {
    static async create(shiftTradeRequest: ShiftTradeRequest) {
        await DatabaseServices.create(
            ShiftTradeRequest,
            API_ROOT,
            shiftTradeRequest,
        );
    }

    static async update(shiftTradeRequest: ShiftTradeRequest) {
        await DatabaseServices.update(
            ShiftTradeRequest,
            API_ROOT,
            shiftTradeRequest,
        );
    }

    static async delete(shiftTradeRequest: ShiftTradeRequest) {
        await DatabaseServices.delete(`${API_ROOT}/${shiftTradeRequest.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<ShiftTradeRequest>(
            ShiftTradeRequest,
            `${API_ROOT}/${id}`,
        );
    }

    static async approve(shiftTradeRequest: ShiftTradeRequest) {
        await apiClient.put(`${API_ROOT}/approve`, {
            id: shiftTradeRequest.id,
        });
    }

    static async deny(shiftOfferRequest: ShiftTradeRequest) {
            await apiClient.put(`${API_ROOT}/deny`, {
                id: shiftOfferRequest.id,
            });
        }

    static async getAllForBusiness(business: Business) {
        return await DatabaseServices.getAll<ShiftTradeRequest>(
            ShiftTradeRequest,
            `${API_ROOT}/business/${business.id}`,
        );
    }

    static async getAllForTargetEmployee(employee: Employee) {
        return await DatabaseServices.getAll<ShiftTradeRequest>(
            ShiftTradeRequest,
            `${API_ROOT}/employee/${employee.id}`,
        )
    }
}
