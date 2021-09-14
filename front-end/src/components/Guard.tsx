import React from 'react';
import { Redirect } from 'react-router-dom';


export interface GuardProps {
    visible: boolean;
    redirectUrl?: string;
}

export const Guard: React.FC<GuardProps> = ({ visible, redirectUrl, children }) => {
    if (visible) {
        return <>{children}</>;
    }

    if (redirectUrl !== undefined) {
        return <Redirect to={redirectUrl} />;
    }

    return null;
};
