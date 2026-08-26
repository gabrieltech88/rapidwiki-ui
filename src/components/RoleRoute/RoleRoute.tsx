import { Navigate, Outlet } from "react-router";

import { useAuth } from "@/contexts/AuthContext";

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