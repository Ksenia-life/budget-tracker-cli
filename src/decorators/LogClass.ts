export function LogClass<T extends new (...args: any[]) => object>(
    constructor: T
) {
    return class extends constructor {
        constructor(...args: any[]) {
            super(...args);
            console.log(
                `Создан экземпляр класса ${constructor.name} с аргументами: ${args.join(", ")}`
            );
        }
    };
}
