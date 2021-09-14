import { checkTypesByKeys } from '../../utils/checkTypesByKeys';


export interface User {
    id: number;
    username: string;
    score: number;
    wins: number;
    loses: number;
}

export const isUser = (user: unknown): user is User => {
    if (typeof user !== 'object' || user === null) {
        return false;
    }

    return checkTypesByKeys(user, {
        id: 'number',
        username: 'string',
        score: 'number',
        wins: 'number',
        loses: 'number',
    });
};
