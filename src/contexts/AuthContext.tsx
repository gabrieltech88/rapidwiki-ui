import {
    createContext,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type { User } from "@/types/User";

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;

    login: (
        email: string,
        password: string
    ) => Promise<void>;

    logout: () => void;

    hasRole: (role: string) => boolean;
}

const AuthContext =
    createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(() => {
        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            return null;
        }

        return JSON.parse(savedUser) as User;
    });

    async function login(
        email: string,
        password: string
    ) {
        if (!email || !password) {
            throw new Error("Credenciais inválidas.");
        }

        await new Promise((resolve) =>
            setTimeout(resolve, 400)
        );

        const fakeUser: User = {
            id: "1",
            name: "Gabriel",
            email,

            departmentId: "1",
            departmentName: "Redes",

            roles: ["Admin"],
        };

        localStorage.setItem(
            "user",
            JSON.stringify(fakeUser)
        );

        setUser(fakeUser);
    }

    function logout() {
        localStorage.removeItem("user");
        setUser(null);
    }

    function hasRole(role: string) {
        return user?.roles.includes(role) ?? false;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: Boolean(user),
                login,
                logout,
                hasRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth deve ser usado dentro de AuthProvider"
        );
    }

    return context;
}