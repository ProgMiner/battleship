import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

import { QueryKey } from '../../queryClient';
import { changeCell } from '../../api/battle';
import { useAuthenticatedMutation } from '../useAuthenticatedMutation';

export const useCellChanging = (): (x: number, y: number) => void => {
    const authenticatedChangeCell = useAuthenticatedMutation(changeCell);
    const queryClient = useQueryClient();

    return useCallback(async (x, y) => {
        const result = await authenticatedChangeCell(x, y);

        if (result !== undefined) {
            queryClient.setQueryData(QueryKey.CURRENT_BATTLE, result);
        }
    }, [authenticatedChangeCell, queryClient]);
};