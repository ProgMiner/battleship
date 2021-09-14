import { checkTypesByKeys } from '../../utils/checkTypesByKeys';

export interface Invitation {
    from: string;
    createdAt: Date;
}

export const jsonToInvitation = (invitation: unknown): Invitation => {
    if (typeof invitation !== 'object' || invitation === null) {
        throw new Error();
    }

    if (!checkTypesByKeys(invitation, {
        from: 'string',
        createdAt: 'string',
    })) {
        throw new Error();
    }

    const { from, createdAt } = invitation as Record<string, unknown>;

    return {
        from: from as string,
        createdAt: new Date(createdAt as string)
    };
};