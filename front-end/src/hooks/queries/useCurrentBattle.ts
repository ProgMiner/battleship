import { useEffect } from 'react';
import { useQueryClient } from 'react-query';

import { useAuthenticatedQuery } from '../useAuthenticatedQuery';
import { QueryKey } from '../../queryClient';
import { Battle, isBattle } from '../../api/data/Battle';
import { getCurrentBattle } from '../../api/battle';
import { useStomp } from '../../stomp';
import { useMe } from './useMe';


export interface UseCurrentGameResult {
    battle: Battle | null | undefined,
    isLoading: boolean,
}

export const useCurrentBattle = (): UseCurrentGameResult => {
    const { data: battle, isLoading } = useAuthenticatedQuery(QueryKey.CURRENT_BATTLE, getCurrentBattle, {
        staleTime: Infinity,
    });

    const queryClient = useQueryClient();
    const { subscribe } = useStomp();
    const { me } = useMe();

    useEffect(() => {
        if (!me) {
            return;
        }

        return subscribe('battle', `/user/${me.username}/battle`, ({ body }) => {
            const battle = JSON.parse(body);

            if (isBattle(battle)) {
                queryClient.setQueryData(QueryKey.CURRENT_BATTLE, battle);
            }
        });
    }, [subscribe, me, queryClient]);

    return { battle, isLoading };
};
