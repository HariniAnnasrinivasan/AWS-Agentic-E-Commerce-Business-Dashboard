'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    user: string | null;
    login: (token: string, username: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    login: () => { },
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Verify token on mount and route change
    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('admin_token');
            const savedUser = localStorage.getItem('admin_user');

            // If no token and not on login page, redirect
            if (!token) {
                setIsAuthenticated(false);
                setUser(null);
                setIsLoading(false);
                if (pathname !== '/login') {
                    router.replace('/login');
                }
                return;
            }

            // If token exists, verify it with backend
            try {
                const res = await fetch('/api/verify', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (res.ok && data.valid) {
                    setIsAuthenticated(true);
                    setUser(savedUser);
                    // If strictly on login page but authenticated, go to dashboard
                    if (pathname === '/login') {
                        router.replace('/');
                    }
                } else {
                    // Invalid token
                    logout();
                }
            } catch (error) {
                console.error("Auth check failed", error);
                logout();
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [pathname, router]); // Re-run on route change to ensure protection

    const login = (token: string, username: string) => {
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', username);
        setIsAuthenticated(true);
        setUser(username);
        router.replace('/');
    };

    const logout = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setIsAuthenticated(false);
        setUser(null);
        router.replace('/login');
    };

    // Show nothing while checking triggered by initial load (optional, or show loading spinner)
    // To avoid flash of protected content, we return null if loading AND not on login
    // But strictly, we can render children and let the effect redirect.
    // For better UX, let's block rendering of protected pages
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-500">Loading...</div>;
    }

    // If not authenticated and NOT on login page, don't render children (waiting for redirect)
    if (!isAuthenticated && pathname !== '/login') {
        return null;
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
