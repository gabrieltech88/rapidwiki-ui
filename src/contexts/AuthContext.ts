import { createContext } from "react";

import type { User } from "@/types/User";


export interface AuthContextType {
    user: User | null;

    isAuthenticated: boolean;

    isLoading: boolean;

    login: (
        email: string,
        password: string
    ) => Promise<void>;

    logout: () => Promise<void>;

    hasRole: (
        role: string
    ) => boolean;
}


export const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );