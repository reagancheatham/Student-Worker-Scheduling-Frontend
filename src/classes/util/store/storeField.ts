export abstract class StoreField<T> {
    public abstract get(): Promise<T | undefined>;

    public abstract set(value: T): void;

    public abstract clear(): void;
}