import {
    Navigate,
    Outlet,
} from "react-router";

import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen";

import { useAuth } from "@/hooks/useAuth";


export function ProtectedRoute() {
    const {
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


    return <Outlet />;
}