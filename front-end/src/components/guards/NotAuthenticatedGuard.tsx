import React from 'react';

import { useToken } from '../../token';
import { Guard } from '../Guard';


export interface NotAuthenticatedGuardProps {
    redirectUrl?: string;
}

export const NotAuthenticatedGuard: React.FC<NotAuthenticatedGuardProps> = ({ redirectUrl, children }) => {
    const { token } = useToken();

    return (
        <Guard visible={token === undefined} redirectUrl={redirectUrl}>
            {children}
        </Guard>
    );
};
