export function LogMethod(
    _target: object,
    methodName: string | symbol,
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    const originalMethod = descriptor.value;

    descriptor.value = function (this: object, ...args: unknown[]) {
        console.log(`Вызов метода ${String(methodName)} с аргументами:`, args);

        const result = originalMethod.apply(this, args);

        console.log(`Метод ${String(methodName)} вернул:`, result);

        return result;
    };

    return descriptor;
}
