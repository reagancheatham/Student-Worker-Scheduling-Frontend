import { Business } from "@classes/database/business.ts";
import { User } from "@classes/database/user.ts";
import { BusinessServices } from "../../services/businessServices.ts";
import { ScheduleTemplate } from "@classes/database/scheduleTemplate.ts";
import { ScheduleTemplateServices } from "../../services/scheduleTemplateServices.ts";

const USER_KEY = "user";
const BUSINESS_KEY = "business";
const LAST_EDITED_TEMPLATE_KEY = "lastEditedTemplate";

export class Store {
    public static getUser(): User | undefined {
        const storedUser = localStorage.getItem(USER_KEY);

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

    public static setUser(user: User): void {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    public static clearUser(): void {
        localStorage.removeItem(USER_KEY);
    }

    public static async getBusiness(): Promise<Business | undefined> {
        const storedBusiness = localStorage.getItem(BUSINESS_KEY);

        if (storedBusiness && storedBusiness != "undefined") {
            try {
                return Business.createFromData(JSON.parse(storedBusiness));
            } catch (error: any) {
                console.error(`Error retrieving business: ${error}`);
                return undefined;
            }
        } else {
            try {
                const user = Store.getUser();

                if (!user) return undefined;

                const businesses = await BusinessServices.getAllForUser(
                    user.id,
                );

                if (!businesses || businesses.length === 0) return undefined;

                Store.setBusiness(businesses[0]);
                return businesses[0];
            } catch (error: any) {
                console.error(`Error retrieving business for user: ${error}`);

                return undefined;
            }
        }
    }

    public static setBusiness(business: Business): void {
        localStorage.setItem(BUSINESS_KEY, JSON.stringify(business));
    }

    public static clearBusiness(): void {
        localStorage.removeItem(BUSINESS_KEY);
    }

    public static async getLastEditedTemplate(): Promise<
        ScheduleTemplate | undefined
    > {
        const business = await this.getBusiness();

        if (!business) return undefined;

        const storedTemplate = localStorage.getItem(LAST_EDITED_TEMPLATE_KEY);

        if (storedTemplate && storedTemplate != "undefined") {
            try {
                const templateData = JSON.parse(storedTemplate);

                if (!templateData.businessID) return undefined;
                else if (templateData.businessID !== business.id) return undefined;

                const template = await ScheduleTemplateServices.get(templateData.id);

                return template;
            } catch (error: any) {
                console.error(
                    `Error retrieving last edited template: ${error}`,
                );

                return undefined;
            }
        }
    }

    public static setLastEditedTemplate(template: ScheduleTemplate): void {
        localStorage.setItem(
            LAST_EDITED_TEMPLATE_KEY,
            JSON.stringify(template),
        );
    }

    public static clearLastEditedTemplate(): void {
        localStorage.removeItem(LAST_EDITED_TEMPLATE_KEY);
    }

    public static clear(): void {
        Store.clearUser();
        Store.clearBusiness();
        this.clearLastEditedTemplate();
    }
}
