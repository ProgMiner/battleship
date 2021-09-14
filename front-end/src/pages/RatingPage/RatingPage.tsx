import React from 'react';
import { cn } from '@bem-react/classname';

import { AuthenticatedGuard } from '../../components/guards/AuthenticatedGuard';
import { Page } from '../../components/Page';
import { GlobalLayout } from '../../layouts/GlobalLayout/GlobalLayout';
import { useTopUsers } from '../../hooks/queries/useTopUsers';
import { useMe } from '../../hooks/queries/useMe';

import './RatingPage.css';


export interface RatingPageProps {
    className?: string
}

const cnRatingPage = cn('RatingPage');

export const RatingPage: React.FC<RatingPageProps> = ({ className }) => {
    const { topUsers } = useTopUsers();
    const { me } = useMe();

    return (
        <AuthenticatedGuard redirectUrl="/login">
            <Page className={cnRatingPage(null, [className])} title="рейтинг игроков">
                <GlobalLayout className={cnRatingPage('Layout')}>
                    <div className={cnRatingPage('Players', { loading: topUsers === undefined })}>
                        {topUsers === undefined ? (
                            <div className={cnRatingPage('Loading')}>
                                Загрузка...
                            </div>
                        ) : topUsers.map((user, index) => (
                            <div key={user.id} className={cnRatingPage('PlayersList', { me: user.username === me?.username })}>
                                <div className={cnRatingPage('PlayersListPosition')}>{index + 1}</div>
                                <div className={cnRatingPage('PlayersListScore')}>
                                    <div className={cnRatingPage('PlayersListTrophy')} />

                                    {user.score}
                                </div>

                                <div className={cnRatingPage('PlayersListUsername')}>
                                    {user.username === me?.username ? 'Вы' : user.username}
                                </div>

                                <div className={cnRatingPage('PlayersListWins')}>победы: {user.wins}</div>
                                <div className={cnRatingPage('PlayersListLoses')}>поражения: {user.loses}</div>
                            </div>
                        ))}
                    </div>
                </GlobalLayout>
            </Page>
        </AuthenticatedGuard>
    );
};