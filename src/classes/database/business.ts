import { DatabaseModel } from "./databaseModel.ts";

export class Business extends DatabaseModel{

    constructor(
        public readonly id: number,
        public readonly name: string,
    ) {
        super();
    }

    public static createFromData(data: any): Business {
            return new Business(
                data["id"] ?? 0,
                data["name"] ?? "",
            );
        }
}
