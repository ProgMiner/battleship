import React from 'react';

import { useToken } from '../../token';
import { Guard } from '../Guard';


export interface AuthenticatedGuardProps {
    redirectUrl?: string;
}

export const AuthenticatedGuard: React.FC<AuthenticatedGuardProps> = ({ redirectUrl, children }) => {
    const { token } = useToken();

    return (
        <Guard visible={token !== undefined} redirectUrl={redirectUrl}>
            {children}
        </Guard>
    );
};