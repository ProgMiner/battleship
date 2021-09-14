import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { rejectInvitation } from '../../api/invitation';
import { QueryKey } from '../../queryClient';
import { useAuthenticatedMutation } from '../useAuthenticatedMutation';


export const useRejectInvitation = (): () => void => {
    const authenticatedRejectInvitation = useAuthenticatedMutation(rejectInvitation);
    const queryClient = useQueryClient();

    return useCallback(async () => {
        try {
            await authenticatedRejectInvitation();
        } catch (e) {
        } finally {
            queryClient.setQueryData(QueryKey.INVITATION, undefined);
        }
    }, [authenticatedRejectInvitation, queryClient]);
};