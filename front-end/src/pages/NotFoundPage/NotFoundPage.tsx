import React from 'react';
import { cn } from '@bem-react/classname';

import { AuthenticatedGuard } from '../../components/guards/AuthenticatedGuard';
import { GlobalLayout } from '../../layouts/GlobalLayout/GlobalLayout';
import { Page } from '../../components/Page';

import './NotFoundPage.css';


export interface NotFoundPageProps {
    className?: undefined;
}

const cnNotFoundPage = cn('NotFoundPage');

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ className }) => {
    return (
        <AuthenticatedGuard redirectUrl={"/login"}>
            <Page className={cnNotFoundPage(null, [className])} title="страница не найдена">
                <GlobalLayout className={cnNotFoundPage('Layout')}>
                    <div className={cnNotFoundPage('Text')}>
                        запрошенной страницы не существует

                        <br />

                        для возвращения на сайт нажмите на любой из пунктов меню в верхней части страницы
                    </div>
                </GlobalLayout>
            </Page>
        </AuthenticatedGuard>
    )
}