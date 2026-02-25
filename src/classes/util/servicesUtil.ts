import { apiClient } from "../../services/services";

export class servicesUtil {

    static async create(path: string, object: any) {
        await apiClient
            .post(path, object)
            .then(() => {
                console.log(`${path} created successfully`);
            })
            .catch((err) => {
                console.log(`Error creating ${path}: ` + err);
            });
    };

    static async update(path: string, object: any) {
        await apiClient
            .put(path, object)
            .then(() => {
                console.log(`${path} updated successfully`);
            })
            .catch((err) => {
                console.log(`Error updating ${path}: ` + err);
            });
    };

    static async delete(path: string) {
        await apiClient
            .delete(path)
            .then(() => {
                console.log(`${path} deleted successfully`);
            })
            .catch((err) => {
                console.log(`Error deleting ${path}: ` + err);
            });
    };
}