import "reflect-metadata";

export function Metadata(key: string, value: any) {
    return function (target: object, propertyKey: string | symbol): void {
        Reflect.defineMetadata(key, value, target, propertyKey);
    };
}
