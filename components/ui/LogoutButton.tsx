'use client';

import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
    const { logout } = useAuth();

    return (
        <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 border border-red-400/20 rounded-lg transition-colors"
        >
            <LogOut className="w-4 h-4" />
            Logout
        </button>
    );
}
