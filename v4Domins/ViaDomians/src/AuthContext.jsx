/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [token, setToken] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get('token');

        if (urlToken) {
            setToken(urlToken);
            localStorage.setItem('auth_token', urlToken);
            window.history.replaceState({}, '', window.location.pathname);
        } else {
            const storedToken = localStorage.getItem('auth_token');
            if (storedToken) setToken(storedToken);
        }

        setIsInitialized(true);
    }, []);

    const login = (newToken) => {
        setToken(newToken);
        localStorage.setItem('auth_token', newToken);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('auth_token');
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated: !!token, isInitialized, login, logout }}>
            {isInitialized ? children : <div>Chargement...</div>}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider');
    return context;
};
