import { Navigate, Outlet } from "react-router";

import { useAuth } from "@/hooks/useAuth";

interface RoleRouteProps {
    role: string;
}

export function RoleRoute({ role }: RoleRouteProps) {
    const { hasRole } = useAuth();

    if (!hasRole(role)) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}