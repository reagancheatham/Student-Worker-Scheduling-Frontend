import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { StoreField } from "./storeField.ts";
import { Store } from "./store.ts";
import { ScheduleTemplateServices } from "../../../services/scheduleTemplateServices.ts";

const STORE_KEY = "lastEditedTemplate";

export class ScheduleTemplateStoreField extends StoreField<ScheduleTemplate> {
    public async get(): Promise<ScheduleTemplate | undefined> {
        const business = await Store.businessStore.get();

        if (!business) return undefined;

        const storedTemplate = localStorage.getItem(STORE_KEY);

        if (storedTemplate && storedTemplate != "undefined") {
            try {
                const templateData = JSON.parse(storedTemplate);

                if (!templateData.businessID) return undefined;
                else if (templateData.businessID !== business.id)
                    return undefined;

                const template = await ScheduleTemplateServices.get(
                    templateData.id,
                );

                return template;
            } catch (error: any) {
                console.error(
                    `Error retrieving last edited template: ${error}`,
                );

                return undefined;
            }
        }
    }

    public set(value: ScheduleTemplate): void {
        localStorage.setItem(STORE_KEY, JSON.stringify(value));
    }

    public clear(): void {
        localStorage.removeItem(STORE_KEY);
    }

    public getUnsafe(): ScheduleTemplate | undefined {
        const storedTemplate = localStorage.getItem(STORE_KEY);

        if (!storedTemplate || storedTemplate === "undefined") return undefined;

        const templateData = JSON.parse(storedTemplate);

        if (!templateData.businessID) return undefined;

        return ScheduleTemplate.create(templateData);
    }
}
