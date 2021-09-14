import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { useAuthenticatedMutation } from '../useAuthenticatedMutation';
import { commitField } from '../../api/battle';
import { useCurrentBattle } from '../queries/useCurrentBattle';
import { QueryKey } from '../../queryClient';


export const useCommitArrangement = (): () => void => {
    const authenticatedCommitArrangement = useAuthenticatedMutation(commitField);
    const { battle } = useCurrentBattle();
    const queryClient = useQueryClient();

    return useCallback(async () => {
        const result = await authenticatedCommitArrangement();

        if (battle && result !== undefined) {
            queryClient.setQueryData(QueryKey.CURRENT_BATTLE, result);
        }
    }, [authenticatedCommitArrangement, battle, queryClient]);
};