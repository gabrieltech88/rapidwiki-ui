import {
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { AuthContext } from "@/contexts/AuthContext";

import {
    getCurrentUser,
    signIn,
    signOut,
} from "@/services/authService";

import type { User } from "@/types/User";


interface AuthProviderProps {
    children: ReactNode;
}


export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] =
        useState<User | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);


    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);
            } catch {
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        }

        loadCurrentUser();
    }, []);


    async function login(
        email: string,
        password: string
    ) {
        const authenticatedUser =
            await signIn(
                email,
                password
            );

        setUser(
            authenticatedUser
        );
    }


    async function logout() {
        try {
            await signOut();
        } finally {
            setUser(null);
        }
    }


    function hasRole(
        role: string
    ) {
        return user?.role === role;
    }


    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated:
                    Boolean(user),
                isLoading,
                login,
                logout,
                hasRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}