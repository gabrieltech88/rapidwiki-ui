import {
    Navigate,
    Outlet,
} from "react-router";

import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";

import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute() {
    const {
        user,
        isAuthenticated,
        isLoading,
    } = useAuth();

    if (isLoading) {
        return <LoadingScreen />;
    }

    if (!isAuthenticated) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    if (user?.mustChangePassword) {
        return (
            <Navigate
                to="/change-password"
                replace
            />
        );
    }

    return <Outlet />;
}