import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { login as loginService, register as registerService, fetchCurrentUser } from '../utils/api';

const AuthContext = createContext();

const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: false,
    loading: true,
    error: null,
};

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            localStorage.setItem('token', action.payload.token);
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token,
                loading: false,
                error: null,
            };
        case 'AUTH_ERROR':
        case 'LOGOUT':
            localStorage.removeItem('token');
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                user: null,
                loading: false,
                error: action.payload || null,
            };
        case 'USER_LOADED':
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                loading: false,
            };
        case 'SET_LOADING':
            return {
                ...state,
                loading: true,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const loadUser = async () => {
            if (state.token) {
                try {
                    const data = await fetchCurrentUser();
                    if (data && data.user) {
                        dispatch({ type: 'USER_LOADED', payload: { user: data.user } });
                    }
                } catch (error) {
                    console.error('Failed to authenticate:', error);
                    dispatch({ type: 'LOGOUT' });
                }
            } else {
                dispatch({ type: 'LOGOUT' });
            }
        };

        loadUser();
    }, [state.token]);

    const login = async (email, password) => {
        try {
            const data = await loginService(email, password);
            dispatch({ type: 'LOGIN_SUCCESS', payload: { token: data.token, user: data.user } });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error.message });
            return error;
        }
    };

    const register = async (name, email, password) => {
        try {
            const data = await registerService(name, email, password);
            dispatch({ type: 'LOGIN_SUCCESS', payload: { token: data.token, user: data.user } });
            return { success: true };
        } catch (error) {
            dispatch({ type: 'AUTH_ERROR', payload: error.message });
            return error;
        }
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
    };

    const value = {
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.error,
        login,
        register,
        logout,
        dispatch
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
