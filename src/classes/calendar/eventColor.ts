export class EventColor {
    public static readonly blue = new EventColor(
        "Blue",
        "event-blue",
        "--color-sky-500",
    );
    public static readonly orange = new EventColor(
        "Orange",
        "event-orange",
        "--color-orange-400",
    );
    public static readonly red = new EventColor(
        "Red",
        "event-red",
        "--color-red-400",
    );
    public static readonly yellow = new EventColor(
        "Yellow",
        "event-yellow",
        "--color-yellow-500",
    );
    public static readonly purple = new EventColor(
        "Purple",
        "event-purple",
        "--color-purple-500",
    );

    public static readonly colors = [
        this.blue,
        this.orange,
        this.red,
        this.yellow,
        this.purple,
    ];

    public constructor(
        public readonly name: string,
        public readonly semantic: string,
        public readonly tailwind: string,
    ) {}

    public static fromString(colorString: string): EventColor {
        switch (colorString) {
            case "Blue":
                return EventColor.blue;
            case "Orange":
                return EventColor.orange;
            case "Red":
                return EventColor.red;
            case "Yellow":
                return EventColor.yellow;
            case "Purple":
                return EventColor.purple;
            default:
                return EventColor.blue;
        }
    }

    public toJSON() {
        return this.name;
    }
}
