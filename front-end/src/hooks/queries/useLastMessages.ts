import { useEffect, useRef } from 'react';
import { useQueryClient } from 'react-query';

import { QueryKey } from '../../queryClient';
import { useAuthenticatedQuery } from '../useAuthenticatedQuery';
import { jsonToMessage, Message } from '../../api/data/Message';
import { getLastMessages } from '../../api/message';
import { useStomp } from '../../stomp';


export interface UseLastMessagesResult {
    lastMessages: Message[] | undefined;
    isLoading: boolean;
}

export const useLastMessages = (): UseLastMessagesResult => {
    const bufferRef = useRef<Message[]>([]);

    const queryClient = useQueryClient();
    const { data: lastMessages, isLoading } = useAuthenticatedQuery(QueryKey.LAST_MESSAGES, getLastMessages, {
        staleTime: Infinity,
        onSuccess: data => {
            if (bufferRef.current.length > 0 && data) {
                queryClient.setQueryData(QueryKey.LAST_MESSAGES, [...data, ...bufferRef.current]);
                bufferRef.current = [];
            }
        },
    });

    const { subscribe } = useStomp();
    useEffect(() => {
        return subscribe('chat', '/all/chat', ({ body }) => {
            const message = jsonToMessage(JSON.parse(body));

            if (queryClient.getQueryState(QueryKey.LAST_MESSAGES)?.data === undefined) {
                bufferRef.current.push(message);
            } else {
                queryClient.setQueryData(
                    QueryKey.LAST_MESSAGES,
                    (messages: Message[] | undefined) => [...messages!, message],
                );
            }
        });
    }, [queryClient, subscribe]);

    return { lastMessages, isLoading };
}
