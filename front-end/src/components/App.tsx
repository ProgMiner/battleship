import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

import { queryClient } from '../queryClient';
import { TokenProvider } from '../token';
import { StompProvider } from '../stomp';
import { routes } from '../routes';


export const App: React.FC = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <TokenProvider>
                <StompProvider>
                    <BrowserRouter>
                        {routes}
                    </BrowserRouter>
                </StompProvider>
            </TokenProvider>
        </QueryClientProvider>
    );
};
