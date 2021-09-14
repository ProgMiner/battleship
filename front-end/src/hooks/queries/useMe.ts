import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

import { isUser, User } from '../../api/data/User';
import { getMe } from '../../api/user';
import { QueryKey } from '../../queryClient';
import { useAuthenticatedQuery } from '../useAuthenticatedQuery';
import { useStomp } from '../../stomp';


export interface UseMeResult {
    me: User | undefined;
    isLoading: boolean;
}

export const useMe = (): UseMeResult => {
    const { data: me, isLoading } = useAuthenticatedQuery(QueryKey.ME, getMe, {
        staleTime: Infinity,
    });

    const queryClient = useQueryClient();
    const { subscribe } = useStomp();

    useEffect(() => {
        if (!me) {
            return;
        }

        return subscribe('me', `/user/${me.username}/me`, ({ body }) => {
            const me = JSON.parse(body);

            if (isUser(me)) {
                queryClient.setQueryData(QueryKey.ME, me);
            }
        });
    });

    return { me, isLoading };
}
