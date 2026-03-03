import { MathUtil } from "./mathUtil.ts";

export class Month {
    private static months = [
        new Month("January", "JAN"),
        new Month("February", "FEB"),
        new Month("March", "MAR"),
        new Month("April", "APR"),
        new Month("May", "MAY"),
        new Month("June", "JUN"),
        new Month("July", "JUL"),
        new Month("August", "AUG"),
        new Month("September", "SEP"),
        new Month("October", "OCT"),
        new Month("November", "NOV"),
        new Month("December", "DEC"),
    ];

    public static January = new Month("January", "JAN");
    public static February = new Month("Feburary", "FEB");
    public static March = new Month("March", "MAR");
    public static April = new Month("April", "APR");
    public static May = new Month("May", "MAY");
    public static June = new Month("June", "JUN");
    public static July = new Month("July", "JUL");
    public static August = new Month("August", "AUG");
    public static September = new Month("September", "SEP");
    public static October = new Month("October", "OCT");
    public static November = new Month("November", "NOV");
    public static December = new Month("December", "DEC");

    private constructor(
        public readonly fullName: string,
        public readonly abbreviation: string,
    ) {}

    public static getMonth(index: number): Month {
        index = MathUtil.clamp(index, 0, 11);

        return Month.months[index];
    }

    public static fromDate(date: Date): Month {
        return this.getMonth(date.getMonth());
    }
}
