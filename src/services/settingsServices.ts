import { Settings } from "@classes/database/settings.ts";
import { apiClient } from "./services.ts";

const API_ROOT = "settings";

export class SettingsServices {
    static async getForBusiness(businessID: number): Promise<Settings | null> {
        const response = await apiClient.get(`${API_ROOT}/${businessID}`);

        if (!response.data) {
            return null;
        }

        return Settings.create(response.data);
    }

    static async save(settings: Settings): Promise<void> {
        // First try update for an existing business settings row.
        const updateResponse = await apiClient.put(API_ROOT, settings);
        const affectedCount = updateResponse.data?.affectedCount ?? 0;

        if (affectedCount > 0) {
            return;
        }

        await apiClient.post(API_ROOT, settings);
    }

    static async getOrCreateDefault(businessID: number): Promise<Settings> {
        const existing = await this.getForBusiness(businessID);

        if (existing) {
            return existing;
        }

        const defaults = Settings.defaultsForBusiness(businessID);
        await apiClient.post(API_ROOT, defaults);
        return defaults;
    }
}
