import { checkTypesByKeys } from '../../utils/checkTypesByKeys';


export interface Message {
    id: number;
    authorName: string;
    content: string;
    createdAt: Date;
}

export const jsonToMessage = (message: unknown): Message => {
    if (typeof message !== 'object' || message === null) {
        throw new Error();
    }

    if (!checkTypesByKeys(message, {
        id: 'number',
        authorName: 'string',
        content: 'string',
        createdAt: 'string',
    })) {
        throw new Error();
    }

    const { id, authorName, content, createdAt } = message as Record<string, unknown>;

    return {
        id: id as number,
        authorName: authorName as string,
        content: content as string,
        createdAt: new Date(createdAt as string),
    };
};