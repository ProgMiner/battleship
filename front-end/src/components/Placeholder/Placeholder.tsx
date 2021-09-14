import React from 'react';
import { cn } from '@bem-react/classname';

import './Placeholder.css';


export interface PlaceholderProps {
    className?: string;
}

const cnPlaceholder = cn('Placeholder');

export const Placeholder: React.FC<PlaceholderProps> = ({ className, children }) => (
    <div className={cnPlaceholder(null, [className])}>
        {children}
    </div>
);
