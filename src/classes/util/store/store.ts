import { UserStoreField } from "./userStoreField.ts";
import { BusinessStoreField } from "./businessStoreField.ts";
import { ScheduleTemplateStoreField } from "./scheduleTemplateStoreField.ts";
import { EmployeeStoreField } from "./employeeStoreField.ts";

export class Store {
    public static readonly userStore = new UserStoreField();
    public static readonly businessStore = new BusinessStoreField();
    public static readonly lastEditedTemplateStore =
        new ScheduleTemplateStoreField();
    public static readonly employeeStore = new EmployeeStoreField()

    public static clear(): void {
        this.userStore.clear();
        this.businessStore.clear();
        this.lastEditedTemplateStore.clear();
        this.employeeStore.clear();
    }
}
