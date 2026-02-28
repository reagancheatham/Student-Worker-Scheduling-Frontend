import {
    DatabaseModel,
    DatabaseModelStatic,
} from "@classes/database/databaseModel.ts";
import { apiClient } from "../../services/services";

export class DatabaseServices {
    static async create(path: string, object: any) {
        await apiClient
            .post(path, object)
            .then(() => {
                console.log(`${path} created successfully`);
            })
            .catch((err) => {
                console.error(`Error creating ${path}: ${JSON.stringify(err)}`);
            });
    }

    static async update(path: string, object: any) {
        await apiClient
            .put(path, object)
            .then(() => {
                console.log(`${path} updated successfully`);
            })
            .catch((err) => {
                console.error(`Error updating ${path}: ${JSON.stringify(err)}`);
            });
    }

    static async delete(path: string) {
        await apiClient
            .delete(path)
            .then(() => {
                console.log(`${path} deleted successfully`);
            })
            .catch((err) => {
                console.error(`Error deleting ${path}: ${JSON.stringify(err)}`);
            });
    }

    static async get<T>(
        model: DatabaseModelStatic<T>,
        path: string,
    ): Promise<T> {
        let finalResult: T | null = null;

        await apiClient
            .get(path)
            .then((result) => {
                finalResult = model.create(result);
                console.log(`${path} found successfully`);
            })
            .catch((err) => {
                console.error(`Error finding ${path}: ${JSON.stringify(err)}`);
                throw err;
            });

        if (finalResult === null)
            throw Error(`Error finding ${path}: invalid result!`);
        else return finalResult;
    }

    static async getAll<T>(
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
            .catch((err) => {
                console.error(`Error finding ${path}: ${JSON.stringify(err)}`);
                throw err;
            });

        return finalResult;
    }
}
