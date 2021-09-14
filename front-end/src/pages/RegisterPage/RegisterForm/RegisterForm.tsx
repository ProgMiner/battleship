import React, { useCallback } from 'react';
import { cn } from '@bem-react/classname';
import { FORM_ERROR, FormApi } from 'final-form';
import { useHistory } from 'react-router-dom';
import { Field, Form } from 'react-final-form';

import { requiredValidator } from '../../../utils/requiredValidator';
import { register } from '../../../api/user';
import { ApiError } from '../../../api/ApiError';

import './RegisterForm.css';


export interface RegisterFormProps {
    className?: string;
}

interface RegisterFormValues {
    username?: string;
    password?: string;
    repeatedPassword?: string;
}

const cnRegisterForm = cn('RegisterForm');

export const RegisterForm: React.FC<RegisterFormProps> = ({ className }) => {
    const onSubmit = useCallback(async ({ username, password, repeatedPassword }: RegisterFormValues, form: FormApi) => {
        if (!username || !password) {
            return;
        }

        if (password !== repeatedPassword) {
            return {
                'repeatedPassword': '',
                [FORM_ERROR]: 'пароли не совпадают',
            }
        }

        try {
            await register(username, password);

            setTimeout(() => {
                for (let field of Object.keys(form.getState().values)) {
                    form.change(field, undefined);
                    form.resetFieldState(field);
                }
            });
        } catch (e) {
            if (e instanceof ApiError) {
                return {
                    [FORM_ERROR]: e.msg,
                };
            }
        }
    }, []);

    const history = useHistory();
    const onLoginButtonClick = useCallback(() => {
        history.push('/login');
    }, [history]);

    return (
        <Form<RegisterFormValues> onSubmit={onSubmit}>
            {({ handleSubmit, hasSubmitErrors, submitError, submitSucceeded }) => (
                <form className={cnRegisterForm(null, [className])} onSubmit={handleSubmit}>
                    <Field<string> name="username" validate={requiredValidator}>
                        {({ input, meta: { touched, error } }) => (
                            <input {...input}
                                   className={cnRegisterForm('Input', { error: touched && error !== undefined })}
                                   placeholder="имя пользователя" />
                        )}
                    </Field>

                    <Field<string> name="password" type="password" validate={requiredValidator}>
                        {({ input, meta: { touched, error } }) => (
                            <input {...input}
                                   className={cnRegisterForm('Input', { error: touched && error !== undefined })}
                                   placeholder="пароль" />
                        )}
                    </Field>

                    <Field<string> name="repeatedPassword" type="password" validate={requiredValidator}>
                        {({ input, meta: { touched, error, submitError } }) => (
                            <input {...input}
                                   className={cnRegisterForm('Input', {
                                       error: (touched && error !== undefined) || submitError !== undefined
                                   })}
                                   placeholder="повторите пароль" />
                        )}
                    </Field>

                    <div className={cnRegisterForm('SubmitError', { success: submitSucceeded })}>
                        {hasSubmitErrors && submitError}
                        {submitSucceeded && 'вы успешно зарегистрированы'}
                    </div>

                    <button type="submit" className={cnRegisterForm('RegisterButton')}>
                        зарегестрироваться
                    </button>

                    <button type="button" onClick={onLoginButtonClick}>
                        вход
                    </button>
                </form>
            )}
        </Form>
    )
};
