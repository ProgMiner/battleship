import { QueryClient } from 'react-query';


export enum QueryKey {
    ME = 'me',
    TOP_USERS = 'top_users',
    LAST_MESSAGES = 'last_messages',
    INVITATION = 'invitation',
    CURRENT_BATTLE = 'current_battle',
}

export const queryClient = new QueryClient();
