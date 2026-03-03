import { Shift } from "@classes/database/shift.ts";
import { EventData } from "./eventData.ts";
import { EventTime } from "./eventTime.ts";
import { ShiftServices } from "../../services/shiftServices.ts";

export class ShiftEvent extends EventData {
    constructor(public readonly shift: Shift) {
        super(
            shift.name,
            EventTime.fromDate(shift.startTime),
            EventTime.fromDate(shift.endTime),
            shift.color,
        );
    }

    public updateBackendEvent(): void {
        this.shift.name = this.name;
        this.shift.startTime = this.startTime.toDate();
        this.shift.endTime = this.endTime.toDate();
        this.shift.color = this.color;

        console.log(JSON.stringify(this.shift));

        ShiftServices.update(this.shift);
    }
}
