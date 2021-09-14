

export const requiredValidator = <T>(value: T) => {
    if (value !== undefined) {
        return undefined;
    }

    return 'поле должно содержать значение';
};
