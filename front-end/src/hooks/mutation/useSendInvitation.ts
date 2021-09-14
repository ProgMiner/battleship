import { useCallback } from 'react';

import { useAuthenticatedMutation } from '../useAuthenticatedMutation';
import { sendInvitation } from '../../api/invitation';
import { ApiError } from '../../api/ApiError';


export const useSendInvitation = (): (toUsername: string) => void => {
    const authenticatedSendInvitation = useAuthenticatedMutation(sendInvitation);

    return useCallback(async toUsername => {
        try {
            await authenticatedSendInvitation(toUsername);
        } catch (e) {
            if (e instanceof ApiError) {
                alert(e.msg);
            }
        }
    }, [authenticatedSendInvitation]);
}