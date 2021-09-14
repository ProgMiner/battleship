import React, { useCallback } from 'react';
import { Field, Form } from 'react-final-form';
import { cn } from '@bem-react/classname';
import { FORM_ERROR } from 'final-form';
import { useHistory } from 'react-router-dom';

import { useToken } from '../../../token';
import { requiredValidator } from '../../../utils/requiredValidator';
import { login } from '../../../api/user';
import { ApiError } from '../../../api/ApiError';

import './LoginForm.css';


export interface LoginFormProps {
    className?: string;
}

interface LoginFormValues {
    username?: string;
    password?: string;
}

const cnLoginForm = cn('LoginForm');

export const LoginForm: React.FC<LoginFormProps> = ({ className }) => {
    const { setToken } = useToken();

    const onSubmit = useCallback(async ({ username, password }: LoginFormValues) => {
        try {
            if (username && password) {
                setToken(await login(username, password));
            }
        } catch (e) {
            if (e instanceof ApiError) {
                return { [FORM_ERROR]: e.msg };
            }
        }
    }, [setToken]);

    const history = useHistory();
    const onRegisterButtonClick = useCallback(() => {
        history.push('/register');
    }, [history]);

    return (
        <Form<LoginFormValues> onSubmit={onSubmit}>
            {({ handleSubmit, hasSubmitErrors, submitError }) => (
                <form className={cnLoginForm(null, [className])} onSubmit={handleSubmit}>
                    <Field<string> name="username" validate={requiredValidator}>
                        {({ input, meta: { touched, error } }) => (
                            <input {...input} className={cnLoginForm('Input', { error: touched && error !== undefined })} placeholder="имя пользователя" />
                        )}
                    </Field>

                    <Field<string> name="password" type="password" validate={requiredValidator}>
                        {({ input, meta: { touched, error } }) => (
                            <input {...input} className={cnLoginForm('Input', { error: touched && error !== undefined })} placeholder="пароль" />
                        )}
                    </Field>

                    <div className={cnLoginForm('SubmitError')}>
                        {hasSubmitErrors && submitError}
                    </div>

                    <button type="submit" className={cnLoginForm('LoginButton')}>
                        войти
                    </button>

                    <button type="button" onClick={onRegisterButtonClick}>
                        зарегестрироваться
                    </button>
                </form>
            )}
        </Form>
    )
};
