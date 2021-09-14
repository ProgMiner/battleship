import React, { useContext, useEffect, useMemo, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client, IMessage, IPublishParams, messageCallbackType } from '@stomp/stompjs';

import { baseUrl } from './config';
import { useToken } from './token';


interface StompContextType {
    subscribe(id: string, topic: string, callback: messageCallbackType): () => void;
    publish(params: IPublishParams): void;
}

interface StompSubscription {
    topic: string;
    callback: messageCallbackType;

    active: boolean;
    buffer: IMessage[];
    subscriptionId?: string;
}

const StompContext = React.createContext<StompContextType>({
    subscribe: () => { throw new Error(); },
    publish: () => {},
});

export const useStomp = (): StompContextType => useContext(StompContext);

const callbackWrapper = (subscription: StompSubscription): messageCallbackType => message => {
    if (subscription.active) {
        subscription.callback(message);
    } else {
        subscription.buffer.push(message);
    }
};

export const StompProvider: React.FC = ({ children }) => {
    const ContextProvider = StompContext.Provider;

    const { token } = useToken();
    const stompRef = useRef<Client | undefined>();
    const publishQueueRef = useRef<IPublishParams[]>([]);
    const subscriptionsRef = useRef(new Map<string, StompSubscription>());

    useEffect(() => {
        if (!token) {
            return;
        }

        const stomp = new Client({
            connectHeaders: {
                'X-Authorization': token,
            },
            webSocketFactory: () => new SockJS(`${baseUrl}/ws`),
            onConnect: () => {
                subscriptionsRef.current.forEach(subscription => {
                    subscription.subscriptionId = stomp.subscribe(subscription.topic, callbackWrapper(subscription)).id;
                });

                publishQueueRef.current.forEach(params => stomp.publish(params));
                publishQueueRef.current = [];
            },
        });

        stomp.activate();
        stompRef.current = stomp;

        return () => {
            stompRef.current?.deactivate();
            stompRef.current = undefined;
        };
    }, [token]);

    const context: StompContextType = useMemo(() => ({
        subscribe: (id, topic, callback) => {
            const existingSubscription = subscriptionsRef.current.get(id);

            if (!existingSubscription) {
                const subscription: StompSubscription = { topic, callback, active: true, buffer: [] };

                subscriptionsRef.current.set(id, subscription);

                if (stompRef.current?.connected) {
                    subscription.subscriptionId = stompRef.current.subscribe(topic, callbackWrapper(subscription)).id;
                }

                return () => {
                    subscription.active = false;
                };
            } else if (existingSubscription.active) {
                // do nothing

                return () => {};
            } else {
                existingSubscription.callback = callback;

                existingSubscription.active = true;
                existingSubscription.buffer.forEach(callback);
                existingSubscription.buffer = [];

                if (existingSubscription.topic !== topic) {
                    existingSubscription.topic = topic;

                    if (stompRef.current?.connected && existingSubscription.subscriptionId !== undefined) {
                        stompRef.current.unsubscribe(existingSubscription.subscriptionId);

                        existingSubscription.subscriptionId = stompRef.current.subscribe(topic, callbackWrapper(existingSubscription)).id;
                    }
                }

                return () => {
                    existingSubscription.active = false;
                };
            }
        },

        publish: params => {
            if (stompRef.current?.connected) {
                stompRef.current.publish(params);
            } else {
                publishQueueRef.current.push(params);
            }
        },
    }), []);

    return (
        <ContextProvider value={context}>
            {children}
        </ContextProvider>
    );
};
