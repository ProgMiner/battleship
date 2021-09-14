import axios from 'axios';
import { ApiError, ApiErrorType } from './ApiError';
import { baseUrl } from '../config';
import { isUser, User } from './data/User';
import { isArrayOf } from '../utils/isArrayOf';


export const login = async (username: string, password: string): Promise<string> => {
    try {
        const token = await axios.post(`${baseUrl}/api/user/login`, { username, password });

        return token.data;
    } catch (e) {
        if (e.response.status === 403) {
            throw ApiError.custom('неверный логин или пароль');
        }

        throw e;
    }
};

export const register = async (username: string, password: string): Promise<void> => {
    try {
        await axios.post(`${baseUrl}/api/user/register`, { username, password });
    } catch (e) {
        if (e.response.status === 403) {
            throw ApiError.custom('данное имя пользователя уже используется');
        }

        throw e;
    }
};

export const getMe = (token: string | undefined) => async (): Promise<User | undefined> => {
    if (!token) {
        return;
    }

    try {
        const { data } = await axios.get(`${baseUrl}/api/user/me`, { headers: { 'Authorization': `Bearer ${token}` } });

        if (isUser(data)) {
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

export const getTopUsers = (token: string | undefined) => async (): Promise<User[] | undefined> => {
    if (!token) {
        return;
    }

    try {
        const { data } = await axios.get(`${baseUrl}/api/user/top`, { headers: { 'Authorization': `Bearer ${token}` } });

        if (isArrayOf(data, isUser)) {
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
