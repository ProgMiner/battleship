import { useQueryClient } from 'react-query';
import { useCallback } from 'react';

import { useAuthenticatedMutation } from '../useAuthenticatedMutation';
import { useCurrentBattle } from '../queries/useCurrentBattle';
import { CellState } from '../../api/data/Battle';
import { QueryKey } from '../../queryClient';
import { ApiError } from '../../api/ApiError';
import { shotCell } from '../../api/battle';


export const useShotCell = (): (x: number, y: number) => void => {
    const authenticatedShotCell = useAuthenticatedMutation(shotCell);
    const { battle } = useCurrentBattle();
    const queryClient = useQueryClient();

    return useCallback(async (x, y) => {
        if (!battle) {
            return;
        }

        if ([CellState.MISS, CellState.SHOT].includes(battle.enemyField[y][x])) {
            throw ApiError.custom('Вы уже стреляли в это поле');
        }

        const result = await authenticatedShotCell(x, y);

        if (result !== undefined) {
            queryClient.setQueryData(QueryKey.CURRENT_BATTLE, result);
        }

    }, [authenticatedShotCell, battle, queryClient]);
};