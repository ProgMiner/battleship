import React from 'react';
import { cn } from '@bem-react/classname';
import { Link, useLocation } from 'react-router-dom';

import { useMe } from '../../hooks/queries/useMe';
import { Placeholder } from '../Placeholder/Placeholder';
import { InvitationBar } from '../InvitationBar/InvitationBar';

import './Header.css';


export interface HeaderProps {
    className?: string;
}

const tabs: [string, string][] = [
    ['чат', '/chat'],
    ['поле боя', '/'],
    ['рейтинг', '/rating'],
];

const cnHeader = cn('Header');

export const Header: React.FC<HeaderProps> = ({ className }) => {
    const location = useLocation();
    const { me } = useMe();

    return (
        <div className={cnHeader(null, [className])}>
            <div className={cnHeader('Top')}>
                <div className={cnHeader('Title')}>
                    марской бой
                </div>

                <div className={cnHeader('PlayerContainer')}>
                    <div className={cnHeader('Player')}>
                        {me ? (
                            <>{me.username} : {me.score}</>
                        ) : (
                            <Placeholder>username : 0</Placeholder>
                        )}
                    </div>

                    <div className={cnHeader('Trophy')} />
                </div>
            </div>

            <div className={cnHeader('Tabs')}>
                {tabs.map(([name, to]) => (
                    <Link key={to} className={cnHeader('Tab', { active: to === location.pathname })} to={to}>
                        {name}
                    </Link>
                ))}
            </div>

            <InvitationBar></InvitationBar>
        </div>
    );
};
