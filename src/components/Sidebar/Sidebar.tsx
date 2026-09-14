import {
    BookOpen,
    ChevronRight,
    FileText,
    Files,
    Home,
    LogOut,
    Plus,
    Settings,
} from "lucide-react";

import {
    NavLink,
    useLocation,
    useNavigate,
} from "react-router";

import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";

import { useAuth } from "@/contexts/AuthContext";
import { departmentsMock } from "@/mocks/departments";

import styles from "./Sidebar.module.css";

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({
    isOpen,
    onClose,
}: SidebarProps) {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        user,
        logout,
        hasRole,
    } = useAuth();

    const canCreateProcedure =
        hasRole("Admin") ||
        hasRole("Editor");

    const canAccessAdmin =
        hasRole("Admin");

    function handleLogout() {
        logout();
        onClose();
        navigate("/login");
    }

    return (
        <aside
            className={`${styles.sidebar} ${
                isOpen ? styles.open : ""
            }`}
        >
            <div className={styles.top}>
                <div className={styles.brand}>
                    <BookOpen size={18} />

                    <span>
                        RapidWiki
                    </span>
                </div>

                <nav className={styles.navigation}>
                    <NavLink
                        to="/"
                        end
                        onClick={onClose}
                        className={({ isActive }) =>
                            `${styles.navItem} ${
                                isActive
                                    ? styles.active
                                    : ""
                            }`
                        }
                    >
                        <Home size={16} />

                        <span>
                            Início
                        </span>
                    </NavLink>

                    <div className={styles.section}>
                        <span className={styles.sectionTitle}>
                            Departamentos
                        </span>

                        {departmentsMock.map(
                            (department) => {
                                const departmentPath =
                                    `/departments/${department.id}`;

                                const isDepartmentActive =
                                    location.pathname.startsWith(
                                        departmentPath
                                    );

                                return (
                                    <div
                                        key={department.id}
                                        className={
                                            styles.departmentGroup
                                        }
                                    >
                                        <NavLink
                                            to={`${departmentPath}/procedures`}
                                            onClick={onClose}
                                            className={`${styles.departmentButton} ${
                                                isDepartmentActive
                                                    ? styles.departmentActive
                                                    : ""
                                            }`}
                                        >
                                            <span>
                                                {department.name}
                                            </span>

                                            <ChevronRight
                                                size={14}
                                                className={`${styles.chevron} ${
                                                    isDepartmentActive
                                                        ? styles.chevronOpen
                                                        : ""
                                                }`}
                                            />
                                        </NavLink>

                                        {isDepartmentActive && (
                                            <div
                                                className={
                                                    styles.departmentSubmenu
                                                }
                                            >
                                                <NavLink
                                                    to={`${departmentPath}/procedures`}
                                                    onClick={onClose}
                                                    className={({
                                                        isActive,
                                                    }) =>
                                                        `${styles.subNavItem} ${
                                                            isActive
                                                                ? styles.subNavActive
                                                                : ""
                                                        }`
                                                    }
                                                >
                                                    <FileText
                                                        size={14}
                                                    />

                                                    <span>
                                                        Procedimentos
                                                    </span>
                                                </NavLink>

                                                <NavLink
                                                    to={`${departmentPath}/documents`}
                                                    onClick={onClose}
                                                    className={({
                                                        isActive,
                                                    }) =>
                                                        `${styles.subNavItem} ${
                                                            isActive
                                                                ? styles.subNavActive
                                                                : ""
                                                        }`
                                                    }
                                                >
                                                    <Files
                                                        size={14}
                                                    />

                                                    <span>
                                                        Documentos
                                                    </span>
                                                </NavLink>
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                        )}
                    </div>
                </nav>
            </div>

            <div className={styles.bottom}>
                {canCreateProcedure && (
                    <NavLink
                        to="/procedures/new"
                        onClick={onClose}
                        className={styles.navItem}
                    >
                        <Plus size={16} />

                        <span>
                            Novo procedimento
                        </span>
                    </NavLink>
                )}

                {canAccessAdmin && (
                    <NavLink
                        to="/admin"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `${styles.navItem} ${
                                isActive
                                    ? styles.active
                                    : ""
                            }`
                        }
                    >
                        <Settings size={16} />

                        <span>
                            Administração
                        </span>
                    </NavLink>
                )}

                <ThemeToggle />

                <button
                    className={styles.navItem}
                    onClick={handleLogout}
                >
                    <LogOut size={16} />

                    <span>
                        Sair
                    </span>
                </button>

                <div className={styles.user}>
                    <div className={styles.avatar}>
                        {user?.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                    </div>

                    <div>
                        <strong>
                            {user?.name}
                        </strong>

                        <span>
                            {user?.roles.join(", ")}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}