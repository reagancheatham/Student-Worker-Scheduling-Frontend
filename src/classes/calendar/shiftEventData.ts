import { Shift } from "@classes/database/shift.ts";
import { EventData } from "./eventData.ts";
import { EventTime } from "./eventTime.ts";
import { ShiftServices } from "../../services/shiftServices.ts";

export class ShiftEventData extends EventData {
    constructor(public readonly shift: Shift) {
        super(
            shift.name,
            EventTime.fromDate(shift.startTime),
            EventTime.fromDate(shift.endTime),
            shift.color,
        );
    }

    public override async updateBackend(): Promise<Shift> {
        this.shift.name = this.name;
        this.shift.startTime = this.startTime.toDate();
        this.shift.endTime = this.endTime.toDate();
        this.shift.color = this.color;

        if (this.shift.isValid()) return ShiftServices.update(this.shift);
        else return ShiftServices.create(this.shift);
    }

    public override async destroy(): Promise<void> {
        if (!this.shift.isValid()) return;

        return ShiftServices.delete(this.shift);
    }

    public override isValid(): boolean {
        return this.shift.isValid();
    }
}
