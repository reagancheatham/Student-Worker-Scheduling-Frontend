export class Range {
    private minimum: number;
    private maximum: number;

    constructor(min: number, max: number) {
        this.minimum = min;
        this.maximum = max;
    }

    get min(): number {
        return this.minimum;
    }
    set min(value: number) {
        if (value > this.maximum) this.maximum = value;

        this.minimum = value;
    }

    get max(): number {
        return this.maximum;
    }
    set max(value: number) {
        if (value < this.minimum) this.minimum = value;

        this.maximum = value;
    }

    lerp(t: number): number {
        return this.min + (this.max - this.min) * t;
    }

    flippedLerp(t: number): number {
        return this.max + (this.min - this.max) * t;
    }
}
