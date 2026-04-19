import { User } from "@classes/database/user.ts";
import { StoreField } from "./storeField.ts";

const STORE_KEY = "user";

export class UserStoreField extends StoreField<User> {
    public async get(): Promise<User | undefined> {
        const storedUser = localStorage.getItem(STORE_KEY);

        if (storedUser && storedUser != "undefined") {
            try {
                const user = JSON.parse(storedUser);
                return new User(
                    user.id,
                    user.studentID,
                    user.permissionRoleID,
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.phoneNumber,
                    user.token,
                    user.profilePicture,
                );
            } catch (error) {
                console.error(`Error parsing user from localStorage: ${error}`);
                return undefined;
            }
        }

        return undefined;
    }

    public set(value: User): void {
        localStorage.setItem(STORE_KEY, JSON.stringify(value));
    }

    public clear(): void {
        localStorage.removeItem(STORE_KEY);
    }

    public getImmediate(): User | undefined {
        const storedUser = localStorage.getItem(STORE_KEY);

        if (storedUser && storedUser != "undefined") {
            try {
                const user = JSON.parse(storedUser);
                return new User(
                    user.id,
                    user.studentID,
                    user.permissionRoleID,
                    user.firstName,
                    user.lastName,
                    user.email,
                    user.phoneNumber,
                    user.token,
                    user.profilePicture,
                );
            } catch (error) {
                console.error(`Error parsing user from localStorage: ${error}`);
                return undefined;
            }
        }
    }
}
