import axios from 'axios';
import { baseUrl } from '../config';
import { ApiError, ApiErrorType } from './ApiError';
import { jsonToMessage, Message } from './data/Message';

export const getLastMessages = (token: string | undefined) => async (): Promise<Message[] | undefined> => {
    if (!token) {
        return;
    }

    try {
        const { data } = await axios.get(`${baseUrl}/api/message`, { headers: { 'Authorization': `Bearer ${token}` } });

        if (Array.isArray(data)) {
            return data.map(jsonToMessage);
        }
    } catch (e) {
        if (e.response.status === 403) {
            throw ApiError.typed(ApiErrorType.NEED_AUTH);
        }

        throw e;
    }

    throw new Error();
};

export const sendMessage = async (token: string | undefined, content: string): Promise<void> => {
    if (!token) {
        return;
    }

    await axios.post(
        `${baseUrl}/api/message`,
        { content },
        { headers: { 'Authorization': `Bearer ${token}` } }
    );
};