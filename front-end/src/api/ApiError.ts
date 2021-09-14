

export enum ApiErrorType {
    NEED_AUTH = 'необходима аутентификация',
}

export class ApiError extends Error {

    private constructor(
        public readonly type: ApiErrorType | undefined,
        public readonly msg: string,
    ) {
        super();
    }

    public static typed(type: ApiErrorType): ApiError {
        return new ApiError(type, type);
    }

    public static custom(msg: string): ApiError {
        return new ApiError(undefined, msg);
    }
}
