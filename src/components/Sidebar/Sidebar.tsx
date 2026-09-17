import {
    ChevronRight,
    FileText,
    Home,
    LogOut,
    Plus,
    Settings,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
    NavLink,
    useNavigate,
} from "react-router";

import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { getDepartments } from "@/services/departmentService";
import { useAuth } from "@/hooks/useAuth";

import type { Department } from "@/types/Department";

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

    const {
        user,
        logout,
        hasRole,
    } = useAuth();

    const [departments, setDepartments] = useState<Department[]>([]);

    const canCreateProcedure =
        hasRole("Admin") ||
        hasRole("Editor");

    const canAccessDrafts =
        hasRole("Admin") ||
        hasRole("Editor");

    const canAccessAdmin =
        hasRole("Admin");

    useEffect(() => {
        let isMounted = true;

        async function loadDepartments() {
            try {
                const data = await getDepartments();

                if (isMounted) {
                    setDepartments(data ?? []);
                }
            } catch (error) {
                console.error(
                    "Erro ao carregar departamentos:",
                    error
                );

                if (isMounted) {
                    setDepartments([]);
                }
            }
        }

        loadDepartments();

        return () => {
            isMounted = false;
        };
    }, []);

    async function handleLogout() {
        await logout();

        onClose();

        navigate(
            "/login",
            {
                replace: true,
            }
        );
    }

    return (
        <aside
            className={`${styles.sidebar} ${
                isOpen
                    ? styles.open
                    : ""
            }`}
        >
            <div className={styles.top}>
                <div className={styles.header}>
                    <div className={styles.brand}>
                        <img
                            src="/favicon.png"
                            alt="RapidWiki"
                            className={styles.logo}
                        />

                        <span>
                            RapidWiki
                        </span>
                    </div>

                    <div className={styles.utilityActions}>
                        <div
                            className={styles.themeToggleCompact}
                            title="Aparência"
                        >
                            <ThemeToggle />
                        </div>

                        <button
                            type="button"
                            className={styles.iconButton}
                            onClick={handleLogout}
                            title="Sair"
                            aria-label="Sair"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>

                <nav className={styles.navigation}>
                    <div className={styles.section}>
                        <span className={styles.sectionTitle}>
                            Acesso rápido
                        </span>

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

                        {canCreateProcedure && (
                            <NavLink
                                to="/procedures/new"
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `${styles.navItem} ${
                                        isActive
                                            ? styles.active
                                            : ""
                                    }`
                                }
                            >
                                <Plus size={16} />

                                <span>
                                    Novo procedimento
                                </span>
                            </NavLink>
                        )}

                        {canAccessDrafts && (
                            <NavLink
                                to="/drafts"
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `${styles.navItem} ${
                                        isActive
                                            ? styles.active
                                            : ""
                                    }`
                                }
                            >
                                <FileText size={16} />

                                <span>
                                    Rascunhos
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
                    </div>

                    <div className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <span className={styles.sectionTitle}>
                                Departamentos
                            </span>
                        </div>

                        <div className={styles.departmentList}>
                            {departments.map((department) => (
                                <NavLink
                                    key={department.id}
                                    to={`/departments/${department.id}/procedures`}
                                    onClick={onClose}
                                    className={({ isActive }) =>
                                        `${styles.departmentItem} ${
                                            isActive
                                                ? styles.departmentItemActive
                                                : ""
                                        }`
                                    }
                                >
                                    <span className={styles.departmentName}>
                                        {department.name}
                                    </span>

                                    <ChevronRight
                                        size={14}
                                        className={styles.departmentChevron}
                                    />
                                </NavLink>
                            ))}
                        </div>
                    </div>
                </nav>
            </div>

            {user && (
                <div className={styles.user}>
                    <div className={styles.avatar}>
                        {user.name
                            .split(" ")
                            .map((name) => name[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                    </div>

                    <div className={styles.userInfo}>
                        <strong>
                            {user.name}
                        </strong>

                        <span>
                            {user.role}
                        </span>
                    </div>
                </div>
            )}
        </aside>
    );
}