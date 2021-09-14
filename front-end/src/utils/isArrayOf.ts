

export const isArrayOf = <T>(value: unknown, typeGuard: (value: unknown) => value is T): value is T[] => {
    if (!Array.isArray(value)) {
        return false;
    }

    return value.every(typeGuard);
}
