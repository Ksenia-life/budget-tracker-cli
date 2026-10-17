export function ReadOnly(target: object, propertyKey: string | symbol): void {
    Object.defineProperty(target, propertyKey, {
        set(this: object, value: unknown) {
            Object.defineProperty(this, propertyKey, {
                value,
                writable: false,
                enumerable: true,
                configurable: false
            });
        },
        configurable: true
    });
}
