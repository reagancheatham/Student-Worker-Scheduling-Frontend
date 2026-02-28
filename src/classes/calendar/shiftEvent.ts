import { Shift } from "@classes/database/shift.ts";
import { EventColor, EventData } from "./eventData.ts";
import { EventTime } from "./eventTime.ts";

export class ShiftEvent extends EventData {
    constructor(
        public readonly shift: Shift,
        public color: EventColor,
    ) {
        super(
            shift.name,
            EventTime.fromDate(shift.startTime),
            EventTime.fromDate(shift.endTime),
            color,
        );
    }
}
