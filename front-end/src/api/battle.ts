import axios from 'axios';
import { baseUrl } from '../config';
import { ApiError, ApiErrorType } from './ApiError';
import { Battle, isBattle } from './data/Battle';
import qs from 'qs';

export const getCurrentBattle = (token: string | undefined) => async (): Promise<Battle | null | undefined> => {
    if (!token) {
        return;
    }

    try {
        const { data } = await axios.get(`${baseUrl}/api/battle`, { headers: { 'Authorization': `Bearer ${token}` } });

        if (data === '') {
            return null;
        }

        if (isBattle(data)) {
            return data;
        }
    } catch (e) {
        if (e.response.status === 403) {
            throw ApiError.typed(ApiErrorType.NEED_AUTH);
        }

        throw e;
    }

    throw new Error();
};

export const changeCell = (token: string | undefined) => async (x: number, y: number): Promise<object | undefined> => {
    if (!token) {
        return;
    }

    try {
        const { data } = await axios.post(
            `${baseUrl}/api/battle/cell`,
            qs.stringify({ x, y }),
            { headers: { 'Authorization': `Bearer ${token}`}},
        );

        if (typeof data == 'object') {
            return data;
        }
    } catch (e) {
        if (e.response.status === 403) {
            throw ApiError.typed(ApiErrorType.NEED_AUTH);
        }

        if (e.response.status === 400) {
            throw ApiError.custom('корабль не может быть длиннее 4-х клеток и располагаться рядом с другим кораблём');
        }

        throw e;
    }
};

export const shotCell = (token: string | undefined) => async (x: number, y: number): Promise<object | undefined> => {
    if (!token) {
        return;
    }

    try {
        const { data } = await axios.post(
            `${baseUrl}/api/battle/step`,
            qs.stringify({x, y}),
            { headers: { 'Authorization': `Bearer ${token}`}},
        );

        if (data && typeof data == 'object') {
            return data;
        }
    } catch (e) {
        if (e.response.status === 403) {
            throw ApiError.typed(ApiErrorType.NEED_AUTH);
        }

        throw e;
    }
}

export const commitField = (token: string | undefined) => async (): Promise<object | undefined> => {
    if (!token) {
        return;
    }

    try {
        const { data } = await axios.post(
            `${baseUrl}/api/battle/commit`,
            undefined,
            { headers: { 'Authorization': `Bearer ${token}`}},
        )

        if (data && typeof data == 'object') {
            return data;
        }
    } catch (e) {
        if (e.response.status === 403) {
            throw ApiError.typed(ApiErrorType.NEED_AUTH);
        }

        if (e.response.status === 400) {
            throw ApiError.custom('корабли расставлены неверно');
        }

        throw e;
    }
}