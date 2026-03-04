import { apiClient } from "../../authServices.ts/services";

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

    static async get<T>(path: string): Promise<T> {
        let finalResult: T | null = null;

        await apiClient
            .get(path)
            .then((result) => {
                console.log('get');
                finalResult = result as T;
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
}
