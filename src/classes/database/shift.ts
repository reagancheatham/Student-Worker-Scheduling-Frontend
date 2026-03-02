import { DatabaseModel } from "./databaseModel.ts";

export class Shift extends DatabaseModel {
    constructor(
        public readonly id: number,
        public readonly businessID: number,
        public readonly employeeID: number,
        public name: string,
        public startTime: Date,
        public endTime: Date,
    ) {
        super();
    }

    protected static createFromData(data: any): Shift {
        console.log("start data: " + data["startTime"]);
        const dataStartTime: Date | undefined = data["startTime"];
        const dataEndTime: Date | undefined = data["endTime"];
        const startTime = dataStartTime
            ? new Date(
                  dataStartTime.getFullYear(),
                  dataStartTime.getMonth(),
                  dataStartTime.getDate(),
                  dataStartTime.getHours(),
                  dataStartTime.getMinutes(),
              )
            : new Date();
        const endTime = dataEndTime
            ? new Date(
                  dataEndTime.getFullYear(),
                  dataEndTime.getMonth(),
                  dataEndTime.getDate(),
                  dataEndTime.getHours(),
                  dataEndTime.getMinutes(),
              )
            : new Date();

        return new Shift(
            data["id"] ?? 0,
            data["businessID"] ?? 0,
            data["employeeID"] ?? 0,
            data["name"] ?? 0,
            startTime,
            endTime,
        );
    }
}
