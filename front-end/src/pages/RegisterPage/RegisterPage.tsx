import React from 'react';
import { cn } from '@bem-react/classname';

import { LoginLayout } from '../../layouts/LoginLayout/LoginLayout';
import { Page } from '../../components/Page';
import { NotAuthenticatedGuard } from '../../components/guards/NotAuthenticatedGuard';
import { RegisterForm } from './RegisterForm/RegisterForm';

import './RegisterPage.css';


export interface RegisterPageProps {
    className?: string;
}

const cnRegisterPage = cn('RegisterPage');

export const RegisterPage: React.FC<RegisterPageProps> = ({ className }) => {
    return (
        <NotAuthenticatedGuard redirectUrl="/">
            <Page className={cnRegisterPage(null, [className])} title="регистрация">
                <LoginLayout className={cnRegisterPage('Layout')}>
                    <div className={cnRegisterPage('Panel')}>
                        <div className={cnRegisterPage('PanelTitle')}>
                            регистрация
                        </div>

                        <div className={cnRegisterPage('PanelContent')}>
                            <RegisterForm className={cnRegisterPage('Form')} />
                        </div>
                    </div>
                </LoginLayout>
            </Page>
        </NotAuthenticatedGuard>
    );
};