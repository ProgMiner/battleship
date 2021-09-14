import React from 'react';
import { cn } from '@bem-react/classname';

import './LoginLayout.css';


export interface LoginLayoutProps {
    className?: string;
}

const cnLoginLayout = cn('LoginLayout');

export const LoginLayout: React.FC<LoginLayoutProps> = ({ className, children }) => {
    return (
        <div className={cnLoginLayout(null, [className])}>
            {children}
        </div>
    );
};
