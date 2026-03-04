export abstract class DatabaseModel {
    public static create<T extends DatabaseModel>(
        this: {
            new (...args: any[]): T;
            createFromData(data: any): T;
        },
        data: any,
    ): T {
        return this.createFromData(data);
    }
}

export interface DatabaseModelStatic<T> {
    create(data: object): T;
}
