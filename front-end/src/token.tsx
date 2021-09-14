import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';


export type TokenType = string | undefined;

export interface TokenContextType {
    token: TokenType;
    setToken: (token: TokenType) => void;
}

export const TokenContext = React.createContext<TokenContextType>({
    token: undefined,
    setToken: () => {},
});

export const useToken = () => useContext(TokenContext);

export const TokenProvider: React.FC = ({ children }) => {
    const ContextProvider = TokenContext.Provider;

    const savedToken = useMemo(() => localStorage.getItem('token') || undefined, []);
    const [token, setTokenState] = useState<TokenType>(savedToken);

    const setToken = useCallback((token: TokenType) => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }

        setTokenState(token);
    }, []);

    const ctx = useMemo(() => ({ token, setToken }), [token, setToken]);

    const queryClient = useQueryClient();
    useEffect(() => {
        if (token === undefined) {
            queryClient.clear();
        }
    }, [queryClient, token]);

    return (
        <ContextProvider value={ctx}>
            {children}
        </ContextProvider>
    );
};
