import { TimeOffRequest } from "@classes/database/timeOffRequest";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "timeOffRequests";

export class TimeOffRequestServices {
  static async create(timeOffRequest: TimeOffRequest) {
    await DatabaseServices.create(TimeOffRequest, API_ROOT, timeOffRequest);
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

  static async getAllForBusiness(businessID: number) {
    return await DatabaseServices.getAll<TimeOffRequest>(
      TimeOffRequest,
      `${API_ROOT}/business/${businessID}`,
    );
  }
}
