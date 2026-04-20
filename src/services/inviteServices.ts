import { Invite } from "@classes/database/invite";
import { DatabaseServices } from "@classes/util/databaseServices";

const API_ROOT: string = "invites";

export class InviteServices {
    static async getAll() {
        return await DatabaseServices.getAll<Invite>(Invite, `${API_ROOT}/`);
    }

    static async delete(code: number) {
        return await DatabaseServices.delete(`${API_ROOT}/invites/${code}`);
    }
}
