import { useEffect } from 'react';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

import { useAuthenticatedQuery } from '../useAuthenticatedQuery';
import { QueryKey } from '../../queryClient';
import { getInvitation } from '../../api/invitation';
import { Invitation, jsonToInvitation } from '../../api/data/Invitation';
import { useStomp } from '../../stomp';
import { useMe } from './useMe';


export interface UseInvitationResult {
    invitation: Invitation | undefined;
}

export const useInvitation = (): UseInvitationResult => {
    const { data: invitation } = useAuthenticatedQuery(QueryKey.INVITATION, getInvitation, {
        staleTime: Infinity,
    });

    const queryClient = useQueryClient();
    const { subscribe } = useStomp();
    const { me } = useMe();

    const history = useHistory();
    useEffect(() => {
        if (!me) {
            return;
        }

        return subscribe('battle_invitation', `/user/${me.username}/battle`, () => {
            const currentBattle = queryClient.getQueryData(QueryKey.CURRENT_BATTLE);

            if (!currentBattle) {
                history.push('/');
            }
        });
    }, [history, me, queryClient, subscribe]);

    useEffect(() => {
        if (!me) {
            return;
        }

        return subscribe('invitation', `/user/${me.username}/invitation`, ({ body }) => {
            const invitation = JSON.parse(body);

            if (invitation === false) {
                queryClient.setQueryData(QueryKey.INVITATION, undefined);
            } else {
                queryClient.setQueryData(QueryKey.INVITATION, jsonToInvitation(invitation));
            }
        });
    }, [subscribe, me, queryClient]);

    return { invitation };
}