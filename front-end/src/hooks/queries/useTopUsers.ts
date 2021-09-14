import { User } from '../../api/data/User';
import { getTopUsers } from '../../api/user';
import { QueryKey } from '../../queryClient';
import { useAuthenticatedQuery } from '../useAuthenticatedQuery';


export interface UseTopUsersResult {
    topUsers: User[] | undefined;
    isLoading: boolean;
}

export const useTopUsers = (): UseTopUsersResult => {
    const { data: topUsers, isLoading } = useAuthenticatedQuery(QueryKey.TOP_USERS, getTopUsers);

    return { topUsers, isLoading };
}
