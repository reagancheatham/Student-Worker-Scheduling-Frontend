import { User } from "@classes/database/user";
import { DatabaseServices } from "@classes/util/databaseServices";

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
            return await DatabaseServices.get<User>(
                User,
                `${API_ROOT}/${id}`,
            );
        }
}