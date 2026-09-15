import {
    useEffect,
    useState,
} from "react";

import {
    BookOpen,
    ChevronRight,
    FilePenLine,
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

    const location = useLocation();

    const {
        user,
        logout,
        hasRole,
    } = useAuth();


    const [departments, setDepartments] =
        useState<Department[]>([]);


    const canManageProcedures =
        hasRole("Admin") ||
        hasRole("Editor");

    const canAccessAdmin =
        hasRole("Admin");


    useEffect(() => {
        let isMounted = true;

        async function loadDepartments() {
            try {
                const data =
                    await getDepartments();

                if (isMounted) {
                    setDepartments(data);
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
                        <span
                            className={
                                styles.sectionTitle
                            }
                        >
                            Departamentos
                        </span>

                        {departments.map(
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
                                                {
                                                    department.name
                                                }
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
                {canManageProcedures && (
                    <>
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


                        <NavLink
                            to="/procedures/drafts"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `${styles.navItem} ${
                                    isActive
                                        ? styles.active
                                        : ""
                                }`
                            }
                        >
                            <FilePenLine size={16} />

                            <span>
                                Rascunhos
                            </span>
                        </NavLink>
                    </>
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
                    type="button"
                    className={styles.navItem}
                    onClick={handleLogout}
                >
                    <LogOut size={16} />

                    <span>
                        Sair
                    </span>
                </button>


                {user && (
                    <div className={styles.user}>
                        <div className={styles.avatar}>
                            {user.name
                                .split(" ")
                                .map(
                                    (name) =>
                                        name[0]
                                )
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>

                        <div>
                            <strong>
                                {user.name}
                            </strong>

                            <span>
                                {user.role}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}