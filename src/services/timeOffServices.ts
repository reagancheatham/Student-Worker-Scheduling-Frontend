import { Business } from "@classes/database/business";
import { TimeOffRequest } from "@classes/database/timeOffRequest";
import { DatabaseServices } from "@classes/util/databaseServices";
import { apiClient } from "./services";
import { Employee } from "@classes/database/employee";

const API_ROOT: string = "timeOffRequests";

export class TimeOffRequestServices {
    static async create(timeOffRequest: TimeOffRequest) {
        await apiClient.post(API_ROOT, timeOffRequest);
    }
    static async update(timeOffRequest: TimeOffRequest) {
        await DatabaseServices.update(TimeOffRequest, API_ROOT, timeOffRequest);
    }

    static async delete(timeOffRequest: TimeOffRequest) {
        await DatabaseServices.delete(`${API_ROOT}/${timeOffRequest.id}`);
    }

    static async get(id: number) {
        return await DatabaseServices.get<TimeOffRequest>(
            TimeOffRequest,
            `${API_ROOT}/${id}`,
        );
    }

    static async getAllForBusiness(business: Business) {
        return await DatabaseServices.getAll<TimeOffRequest>(
            TimeOffRequest,
            `${API_ROOT}/business/${business.id}`,
        );
    }

    static async getAllForEmployee(employee: Employee) {
        return await DatabaseServices.getAll<TimeOffRequest>(
            TimeOffRequest,
            `${API_ROOT}/employee/${employee.id}`,
        );
    }

    static async approve(timeOffRequest: TimeOffRequest) {
        await apiClient.put(`${API_ROOT}/approve`, {
            id: timeOffRequest.id,
        });
    }

    static async deny(shiftOfferRequest: TimeOffRequest) {
        await apiClient.put(`${API_ROOT}/deny`, {
            id: shiftOfferRequest.id,
        });
    }
}
