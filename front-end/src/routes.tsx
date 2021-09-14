import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { RatingPage } from './pages/RatingPage/RatingPage';
import { ChatPage } from './pages/ChatPage/ChatPage';
import { BattlePage } from './pages/BattlePage/BattlePage';
import { NotFoundPage } from './pages/NotFoundPage/NotFoundPage';


export const routes: React.ReactNode = (
    <Switch>
        <Route path="/login" exact>
            <LoginPage/>
        </Route>

        <Route path="/register" exact>
            <RegisterPage/>
        </Route>

        <Route path="/rating" exact>
            <RatingPage/>
        </Route>

        <Route path="/chat" exact>
            <ChatPage/>
        </Route>

        <Route path="/" exact>
            <BattlePage/>
        </Route>

        <Route>
            <NotFoundPage/>
        </Route>
    </Switch>
);
