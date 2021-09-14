import { useCallback } from 'react';

import { TokenType, useToken } from '../token';
import { ApiError, ApiErrorType } from '../api/ApiError';


export const useAuthenticatedMutation = <P extends unknown[], R extends unknown>(
    mutation: (token: TokenType) => (...args: P) => Promise<R>
): (...args: P) => Promise<R> => {
    const { token, setToken } = useToken();

    return useCallback(async (...args: P): Promise<R> => {
        try {
            return await mutation(token)(...args);
        } catch (e) {
            if (e instanceof ApiError && e.type === ApiErrorType.NEED_AUTH) {
                setToken(undefined);
            }

            throw e;
        }
    }, [mutation, token, setToken]);
};
