import React from 'react';
import { cn } from '@bem-react/classname';

import { Page } from '../../components/Page';
import { LoginLayout } from '../../layouts/LoginLayout/LoginLayout';
import { LoginForm } from './LoginForm/LoginForm';
import { NotAuthenticatedGuard } from '../../components/guards/NotAuthenticatedGuard';

import './LoginPage.css';


export interface LoginPageProps {
    className?: string;
}

const cnLoginPage = cn('LoginPage');

export const LoginPage: React.FC<LoginPageProps> = ({ className }) => {
    return (
        <NotAuthenticatedGuard redirectUrl="/">
            <Page className={cnLoginPage(null, [className])} title="вход">
                <LoginLayout className={cnLoginPage('Layout')}>
                    <div className={cnLoginPage('Panel')}>
                        <div className={cnLoginPage('PanelTitle')}>
                            вход
                        </div>

                        <div className={cnLoginPage('PanelContent')}>
                            <LoginForm className={cnLoginPage('Form')} />
                        </div>
                    </div>
                </LoginLayout>
            </Page>
        </NotAuthenticatedGuard>
    );
};
