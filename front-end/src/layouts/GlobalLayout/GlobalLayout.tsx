import React from 'react';
import { cn } from '@bem-react/classname';

import { Header } from '../../components/Header/Header';

import './GlobalLayout.css';


export interface GlobalLayoutProps {
    className?: string;
    header?: React.ReactNode;
}

const cnGlobalLayout = cn('GlobalLayout');

export const GlobalLayout: React.FC<GlobalLayoutProps> = ({
        className,
        header = <Header />,
        children
}) => {
    return (
        <div className={cnGlobalLayout(null, [className])}>
            <header className={cnGlobalLayout('Header')}>
                {header}
            </header>

            <div className={cnGlobalLayout('Content')}>
                {children}
            </div>

            <footer className={cnGlobalLayout('Footer')}>
                <div>Марской бой</div>

                <div>
                    <div>автор идеи и дизайна — Гневанов Андрей</div>
                    <div className={cnGlobalLayout('FooterYear')}>2021</div>
                </div>
            </footer>
        </div>
    );
};
