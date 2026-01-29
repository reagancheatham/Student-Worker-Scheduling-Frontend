export class MathUtil {
    static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }
}
