import { Business } from "@classes/database/business";
import { TimeOffRequest } from "@classes/database/timeOffRequest";
import { ApprovalStatus } from "@classes/util/approvalStatus";
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

  static async getAllForBusiness(business: Business) {
    return await DatabaseServices.getAll<TimeOffRequest>(
      TimeOffRequest,
      `${API_ROOT}/business/${business.id}`,
    );
  }

  static async approve(timeOffRequest: TimeOffRequest) {
    timeOffRequest.status = ApprovalStatus.Approved;
    return await this.update(timeOffRequest)
  }

  static async deny(timeOffRequest: TimeOffRequest) {
    timeOffRequest.status = ApprovalStatus.Denied;
    return await this.update(timeOffRequest)
  }
}
