export class Vector2 {
    public static zero: Vector2 = new Vector2(0, 0);

    constructor(public x: number, public y: number) {}

    magnitude(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}