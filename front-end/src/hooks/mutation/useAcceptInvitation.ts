import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';

import { acceptInvitation } from '../../api/invitation';
import { ApiError } from '../../api/ApiError';
import { QueryKey } from '../../queryClient';
import { useAuthenticatedMutation } from '../useAuthenticatedMutation';


export const useAcceptInvitation = (): () => void => {
    const history = useHistory();
    const authenticatedAcceptInvitation = useAuthenticatedMutation(acceptInvitation);
    const queryClient = useQueryClient();

    return useCallback(async () => {
        try {
            await authenticatedAcceptInvitation();

            history.push('/');
            queryClient.setQueryData(QueryKey.INVITATION, undefined);
        } catch (e) {
            if (e instanceof ApiError) {
                alert(e.msg);
            }
        }
    }, [authenticatedAcceptInvitation, queryClient, history]);
};
