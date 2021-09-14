import React from 'react';
import { cn } from '@bem-react/classname';
import { Helmet } from 'react-helmet';


export interface PageProps {
    className?: string;
    title?: string;

    onClick?: React.MouseEventHandler;
}

const cnPage = cn('Page');

export const Page: React.FC<PageProps> = ({ className, title, onClick, children }) => {
    return (
        <div className={cnPage(null, [className])} onClick={onClick}>
            <Helmet>
                <title>
                    {title ? (
                        `${title} - марской бой`
                    ) : (
                        'марской бой'
                    )}
                </title>
            </Helmet>

            {children}
        </div>
    );
};
