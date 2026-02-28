export abstract class DatabaseModel {
    static create<T extends DatabaseModel>(
        this: { new (...args: any[]): T; createFromData(data: object): T },
        data: object
    ): T {
        return this.createFromData(data);
    }
}

export interface DatabaseModelStatic<T> {
    create(data: object): T;
}