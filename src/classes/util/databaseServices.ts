import { DatabaseModelStatic } from "@classes/database/databaseModel.ts";
import { apiClient } from "../../services/services";

export class DatabaseServices {
    public static async create<T>(
        model: DatabaseModelStatic<T>,
        path: string,
        object: any,
    ): Promise<T> {
        let finalResult: T | null = null;

        await apiClient
            .post(path, object)
            .then((result) => {
                finalResult = model.create(result.data);
                console.log(`${path} created successfully`);
            })
            .catch((error) => {
                console.error(`Error creating ${path}: ${error.message}`);
                return null;
            });

        if (finalResult === null)
            throw Error(`Error creating ${path}: invalid result!`);
        else return finalResult;
    }

    public static async update<T>(
        model: DatabaseModelStatic<T>,
        path: string,
        object: any,
    ): Promise<T> {
        let finalResult: T | null = null;
        let error = "";

        await apiClient
            .put(path, object)
            .then((result) => {
                finalResult = model.create(result.data);
                console.log(`${path} updated successfully`);
            })
            .catch((error) => {
                error =
                    error?.response?.data?.message ??
                    error?.response?.data ??
                    error?.message ??
                    "Unknown error";
                console.error(`Error updating ${path}: ${error}`);
            });

        if (finalResult === null)
            throw Error(`Error editing ${path}: ${error}`);
        else return finalResult;
    }

    public static async delete(path: string) {
        await apiClient
            .delete(path)
            .then(() => {
                console.log(`${path} deleted successfully`);
            })
            .catch((error) => {
                console.error(`Error deleting ${path}: ${error.message}`);
            });
    }

    public static async get<T>(
        model: DatabaseModelStatic<T>,
        path: string,
    ): Promise<T> {
        let finalResult: T | null = null;

        await apiClient
            .get(path)
            .then((result) => {
                finalResult = model.create(result.data);
                console.log(`${path} found successfully`);
            })
            .catch((error) => {
                console.error(`Error finding ${path}: ${error.message}`);
                throw error;
            });

        if (finalResult === null)
            throw Error(`Error finding ${path}: invalid result!`);
        else return finalResult;
    }

    public static async getAll<T>(
        model: DatabaseModelStatic<T>,
        path: string,
    ): Promise<T[]> {
        let finalResult: T[] = [];

        await apiClient
            .get(path)
            .then((results) => {
                const data = results.data as object[];

                data.forEach((element) => {
                    finalResult.push(model.create(element));
                });

                console.log(`${path} found successfully`);
            })
            .catch((error) => {
                console.error(`Error finding ${path}: ${error.message}`);
                throw error;
            });

        return finalResult;
    }
}
