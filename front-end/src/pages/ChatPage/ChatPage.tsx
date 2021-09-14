import React, { useCallback, useRef, useState } from 'react';
import { cn } from '@bem-react/classname';
import { Field, Form } from 'react-final-form';
import { FORM_ERROR, FormApi } from 'final-form';

import { AuthenticatedGuard } from '../../components/guards/AuthenticatedGuard';
import { Page } from '../../components/Page';
import { GlobalLayout } from '../../layouts/GlobalLayout/GlobalLayout';
import { useMe } from '../../hooks/queries/useMe';
import { useLastMessages } from '../../hooks/queries/useLastMessages';
import { useSendInvitation } from '../../hooks/mutation/useSendInvitation';
import { ApiError } from '../../api/ApiError';
import { sendMessage } from '../../api/message';
import { useToken } from '../../token';
import { useAutoScroll } from '../../hooks/useAutoScroll';

import './ChatPage.css';


export interface ChatPageProps {
    className?: undefined;
}

interface ChatFormValues {
    message?: string;
}

interface PlayerMenu {
    username: string;
    x: number;
    y: number;
}

const cnChatPage = cn('ChatPage');

const onShiftEnter = (f: () => void) => (event: React.KeyboardEvent) => {
    if (event.shiftKey && event.code === 'Enter') {
        f();
        event.preventDefault();
    }
};

export const ChatPage: React.FC<ChatPageProps> = ({ className }) => {
    const { lastMessages } = useLastMessages();
    const { token } = useToken();
    const { me } = useMe();

    const messagesRef = useRef<HTMLDivElement>(null);
    const onScroll = useAutoScroll(messagesRef, [lastMessages]);

    const [playerMenu, setPlayerMenu] = useState<PlayerMenu | undefined>();
    const onChatPageClick = useCallback(() => setPlayerMenu(undefined), []);
    const onMessageIconClick = useCallback((username: string) => (event: React.MouseEvent) => {
        if (!messagesRef.current) {
            return;
        }

        const messagesBounds = messagesRef.current.getBoundingClientRect();

        setPlayerMenu({
            username,
            x: event.clientX - messagesBounds.x,
            y: event.clientY - messagesBounds.y + messagesRef.current.scrollTop,
        });

        event.preventDefault();
        event.stopPropagation();
    }, []);

    const sendInvitation = useSendInvitation();
    const onInviteClick = useCallback(async () => {
        if (playerMenu?.username) {
            sendInvitation(playerMenu.username);
        }
    }, [playerMenu?.username, sendInvitation]);

    const onSubmit = useCallback(async ({ message }: ChatFormValues, form: FormApi) => {
        try {
            if (message) {
                await sendMessage(token, message);

                setTimeout(() => form.reset());
            }
        } catch (e) {
            if (e instanceof ApiError) {
                return { [FORM_ERROR]: e.msg };
            }
        }
    }, [token]);

    return (
        <AuthenticatedGuard redirectUrl="/login">
            <Page className={cnChatPage(null, [className])} title="глобальный чат" onClick={onChatPageClick}>
                <GlobalLayout className={cnChatPage('Layout')}>
                    <div className={cnChatPage('Chat')}>
                        <div ref={messagesRef} className={cnChatPage('Messages', {
                            loading: lastMessages === undefined || lastMessages.length === 0
                        })} onScroll={onScroll}>
                            {lastMessages === undefined ? (
                                <div className={cnChatPage('Loading')}>
                                    Загрузка...
                                </div>
                            ) : lastMessages.length === 0 ? (
                                <div className={cnChatPage('MessagesEmpty')}>
                                    сообщений ещё нет
                                </div>
                            ) : lastMessages.map((message) => (
                                <div key={message.id} className={cnChatPage('MessageContainer', {
                                    mine: me?.username === message.authorName
                                })}>
                                    <button className={cnChatPage('MessageIcon')}
                                            title="нажмите для вызова игрока на бой"
                                            onClick={onMessageIconClick(message.authorName)}
                                            onContextMenu={onMessageIconClick(message.authorName)}
                                    />

                                    <div className={cnChatPage('Message')}>
                                        <div className={cnChatPage('MessageAuthor')}>{message.authorName}</div>
                                        <div className={cnChatPage('MessageContent')}>
                                            {message.content.split('\n').map((line, i) => (
                                                <React.Fragment key={`${message.id}_${i}`}>
                                                    {line}
                                                    <br />
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {playerMenu && (
                                <div className={cnChatPage('PlayerMenu')} style={{
                                    top: playerMenu.y,
                                    left: playerMenu.x,
                                }}>
                                    <button className={cnChatPage('PlayerMenuButton')} onClick={onInviteClick}>
                                        вызвать на бой!
                                    </button>
                                </div>
                            )}
                        </div>

                        <Form<ChatFormValues> onSubmit={onSubmit}>
                            {({ handleSubmit, form }) => (
                                <form onSubmit={handleSubmit} className={cnChatPage('MessageForm')}>
                                    <Field<string> name="message">
                                        {({ input }) => (
                                            <textarea {...input}
                                                className={cnChatPage('MessageFormInput')}
                                                onKeyDown={onShiftEnter(() => form.submit())}
                                                placeholder="Введите текст сообщения:" />
                                        )}
                                    </Field>

                                    <button className={cnChatPage('MessageFormButton')} />
                                </form>
                            )}
                        </Form>
                    </div>
                </GlobalLayout>
            </Page>
        </AuthenticatedGuard>
    )
}