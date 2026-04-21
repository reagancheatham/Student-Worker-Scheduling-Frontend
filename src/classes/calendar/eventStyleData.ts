import { Vector2 } from "@classes/util/vector.ts";
import { CalendarData } from "./calendarData.ts";
import { EventData } from "./eventData.ts";

export class EventStyleData {
    public constructor(
        public readonly event: EventData,
        public readonly calendarData: CalendarData,
        public readonly cellSize: Vector2,
        public readonly editable: boolean,
    ) {}
}
