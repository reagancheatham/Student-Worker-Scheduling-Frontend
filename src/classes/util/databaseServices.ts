import { DatabaseModelStatic } from "@classes/database/databaseModel.ts";
import { apiClient } from "../../services/services";

export class DatabaseServices {
    public static async create<T>(
        model: DatabaseModelStatic<T>,
        path: string,
        object: any,
    ): Promise<T> {
        try {
            const result = await apiClient.post(path, object);

            console.log("creating model...");
            const modelValue = model.create(result.data);
            console.log(`${path} created successfully`);

            return modelValue;
        } catch (error: any) {
            console.error(`Error creating ${path}: ${error.message}`);
            throw error;
        }
    }

    public static async update<T>(
        model: DatabaseModelStatic<T>,
        path: string,
        object: any,
    ): Promise<T> {
        try {
            const result = await apiClient.put(path, object);

            const modelValue = model.create(result.data);
            console.log(`${path} updated successfully`);

            return modelValue;
        } catch (error: any) {
            console.error(`Error updating ${path}: ${error.message}`);
            throw error;
        }
    }

    public static async delete(path: string) {
        try {
            await apiClient.delete(path);

            console.log(`${path} deleted successfully`);
        } catch (error: any) {
            console.error(`Error deleting ${path}: ${error.message}`);
            throw error;
        }
    }

    public static async get<T>(
        model: DatabaseModelStatic<T>,
        path: string,
    ): Promise<T> {
        try {
            const result = await apiClient.get(path);

            const modelValue = model.create(result.data);
            console.log(`${path} found successfully`);

            return modelValue;
        } catch (error: any) {
            console.error(`Error finding ${path}: ${error.message}`);
            throw error;
        }
    }

    public static async getAll<T>(
        model: DatabaseModelStatic<T>,
        path: string,
    ): Promise<T[]> {
        try {
            const result = await apiClient.get(path);
            const data = result.data as object[];
            const values: T[] = [];

            if (data && Array.isArray(data))
                data.forEach((element) => values.push(model.create(element)));

            console.log(`${path} found successfully`);
            return values;
        } catch (error: any) {
            console.error(`Error finding ${path}: ${error.message}`);
            throw error;
        }
    }
}
