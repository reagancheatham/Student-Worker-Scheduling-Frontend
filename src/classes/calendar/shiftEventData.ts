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

        let updatedShift: Shift = this.shift;

        if (this.shift.isValid())
            updatedShift = await ShiftServices.update(this.shift);
        else updatedShift = await ShiftServices.create(this.shift);

        const taskList = await this.shift.taskList.updateBackend(updatedShift);

        this.shift.taskList = taskList;

        return updatedShift;
    }

    public override async destroy(): Promise<void> {
        if (!this.shift.isValid()) return;

        return ShiftServices.delete(this.shift);
    }

    public override isValid(): boolean {
        return this.shift.isValid();
    }
}
