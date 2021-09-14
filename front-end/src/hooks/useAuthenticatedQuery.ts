import { UseQueryOptions, UseQueryResult } from 'react-query/types/react/types';
import { QueryFunction, QueryKey, useQuery } from 'react-query';

import { ApiError, ApiErrorType } from '../api/ApiError';
import { useToken } from '../token';


export const useAuthenticatedQuery = <TQueryFnData = unknown, TError = unknown, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(
    key: TQueryKey,
    fn: (token: string | undefined) => QueryFunction<TQueryFnData, TQueryKey>,
    options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> = {},
): UseQueryResult<TData, TError> => {
    const { token, setToken } = useToken();

    return useQuery(key, fn(token), {
        retry: false,

        ...options,

        onError: err => {
            if (err instanceof ApiError && err.type === ApiErrorType.NEED_AUTH) {
                setToken(undefined);
            }

            if (options.onError) {
                options.onError(err);
            }
        },
    });
};
