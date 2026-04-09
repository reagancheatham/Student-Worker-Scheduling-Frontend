export class UIIDUtil {
    public static attachUUID(obj: any, prefix: string): void {
        if (obj.id && obj.id > 0) obj._uiID = `${prefix}-${obj.id}`;
        else obj._uiID = `${prefix}-${crypto.randomUUID()}`;
    }
}
