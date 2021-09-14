import { Invitation, jsonToInvitation } from './data/Invitation';
import axios from 'axios';
import { baseUrl } from '../config';
import { ApiError, ApiErrorType } from './ApiError';
import { TokenType } from '../token';

export const getInvitation = (token: TokenType) => async (): Promise<Invitation | undefined> => {
    if (!token) {
        return;
    }

    try {
        const { data } = await axios.get(`${baseUrl}/api/battle/invite`, { headers: { 'Authorization': `Bearer ${token}` } });

        return jsonToInvitation(data);
    } catch (e) {
        if (e.response.status === 403) {
            throw ApiError.typed(ApiErrorType.NEED_AUTH);
        }

        if (e.response.status === 404) {
            return undefined;
        }

        throw e;
    }
};

export const acceptInvitation = (token: TokenType) => async (): Promise<void> => {
    if (!token) {
        return;
    }

    try {
        await axios.post(
            `${baseUrl}/api/battle/invite/accept`,
            undefined,
            { headers: { 'Authorization': `Bearer ${token}` } },
        );
    } catch (e) {
        if (e.response.status === 403) {
            throw ApiError.typed(ApiErrorType.NEED_AUTH);
        }

        if (e.response.status === 409) {
            throw ApiError.custom('вы уже в игре');
        }

        if (e.response.status === 404) {
            throw ApiError.custom('приглашение истекло');
        }
    }
};

export const rejectInvitation = (token: TokenType) => async (): Promise<void> => {
    if (!token) {
        return;
    }

    try {
        await axios.delete(
            `${baseUrl}/api/battle/invite/reject`,
            { headers: { 'Authorization': `Bearer ${token}` } },
        );
    } catch (e) {
        if (e.response.status === 403) {
            throw ApiError.typed(ApiErrorType.NEED_AUTH);
        }

        if (e.response.status === 404) {
            throw ApiError.custom('у вас нет приглашений');
        }
    }
};

export const sendInvitation = (token: TokenType) => async (toUsername: string) => {
    if (!token) {
        return;
    }

    try {
        await axios.post(
            `${baseUrl}/api/battle/invite/${toUsername}`,
            undefined,
            { headers: { 'Authorization': `Bearer ${token}` } },
        );
    } catch (e) {
        switch (e.response.status) {
            case 403:
                throw ApiError.typed(ApiErrorType.NEED_AUTH);

            case 409:
                throw ApiError.custom('игрока кто-то уже пригласил');

            case 400:
                throw ApiError.custom('имя пользователя оппонента указано неверно');

            default:
                throw e;
        }

    }
};
