import { User } from "@classes/database/user";
import { DatabaseServices } from "@classes/util/databaseServices";
import { apiClient } from "./services";

const API_ROOT = "users";

export class UserServices {
    public static async create(user: User) {
        await DatabaseServices.create(User, API_ROOT, user);
    }

    public static async update(user: User) {
        await DatabaseServices.update(User, API_ROOT, user);
    }

    public static async delete(user: User) {
        await DatabaseServices.delete(`${API_ROOT}/${user.id}`);
    }

    public static async get(id: number) {
        return await DatabaseServices.get<User>(User, `${API_ROOT}/${id}`);
    }

    public static async getAll() {
        try {
            const result = await apiClient.get(`${API_ROOT}/`);
            console.log(`${API_ROOT}/ found successfully`)
            return result.data as any[];
        } catch (error: any) {
            console.error(`Error finding ${API_ROOT}: ${error.message}`);
            return [];
        }
    }
}
