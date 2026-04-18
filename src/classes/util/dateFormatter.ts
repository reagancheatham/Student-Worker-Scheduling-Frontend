export class DateFormatter {

    //Wrote this because i needed date formatting outside of shift.ts
    //im sure there was some smart way to avoid this

    //1-12
    public static day(date: Date): string {
        return date.getDate().toString()
    }

    //April
    public static month(date: Date): string {
        return date.toLocaleString("default", { month: "long" });
    }

    //apr
    public static shortMonth(date: Date): string {
        return date.toLocaleString("default", { month: "short" });
    }

    //2026
    public static year(date: Date): string {
        return date.getFullYear().toString();
    }

    //Thursday
    public static weekday(date: Date): string {
        return date.toLocaleString("default", { weekday: "long" });
    }

    //Thu
    public static shortWeekday(date: Date): string {
        return date.toLocaleString("default", { weekday: "short" });
    }

    //2:00 PM to 5:00 PM
    public static shiftTime(startDate: Date, endDate: Date): string {
        const formatTime = (date: Date): string => {
            return date.toLocaleString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
            });
        };

        return `${formatTime(startDate)} to ${formatTime(endDate)}`;
    }

    //2:00 PM
    public static startTimeFormatted(startDate: Date): string {
        return startDate.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    //5:00 PM
    public static endTimeFormatted(endDate: Date): string {
        return endDate.toLocaleString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    public static shiftLengthHours(startDate: Date, endDate: Date): string {
        const diffMs = endDate.getTime() - startDate.getTime();
        const totalSeconds = Math.floor(diffMs / 1000);
        const hours = Math.floor(totalSeconds / 3600);

        return `${hours}`;
    }

    public static shiftLengthMinutes(startDate: Date, endDate: Date): string {
        const diffMs = endDate.getTime() - startDate.getTime();
        const totalSeconds = Math.floor(diffMs / 1000);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return `${minutes}`;
    }

    public getShiftLength(hoursString: string, minutesString: string): string {
        const hours = parseInt(hoursString) || 0;
        const minutes = parseInt(minutesString) || 0;

        const parts: string[] = [];

        if (hours > 0) {
            parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
        }
        if (minutes > 0) {
            parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
        }

        if (parts.length === 0) {
            return "0 minutes";
        }

        return parts.join(" and ");
    }

    //April 9, 2026
    public static dateFormatted(startDate: Date): string {
        return startDate.toLocaleString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }
}