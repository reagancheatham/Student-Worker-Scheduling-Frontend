import { DatabaseModel } from "./databaseModel.ts";

export enum CompleteStatus {
    Incomplete = "Incomplete",
    Complete = "Incomplete",
}

export class Task extends DatabaseModel {
    public constructor(
        public readonly id: number,
        public readonly taskListID: number,
        public readonly name: string,
        public readonly description: string,
        public readonly completeStatus: CompleteStatus,
    ) {
        super();
    }

    public static createFromData(data: any): Task {
        let completeStatus = CompleteStatus.Incomplete;

        if (data["completeStatus"] == "COMPLETE")
            completeStatus = CompleteStatus.Complete;

        return new Task(
            data["id"] ?? 0,
            data["taskListID"] ?? 0,
            data["name"] ?? 0,
            data["description"] ?? "",
            completeStatus,
        );
    }
}
