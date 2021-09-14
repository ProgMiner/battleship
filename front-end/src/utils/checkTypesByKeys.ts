

export function checkTypesByKeys<K extends Record<string, string>>(object: object, keys: K): object is { [K1 in keyof K]: unknown } {
    for (let key of Object.keys(keys)) {
        if (typeof (object as Record<string, unknown>)[key] !== keys[key]) {
            return false;
        }
    }

    return true;
}
