import {
    BookOpen,
    Home,
    Plus,
    Settings,
} from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle/ThemeToggle";
import { NavLink } from "react-router";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router";

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

    function handleLogout() {
        logout();
        onClose();
        navigate("/login");
    }

    const {
        user,
        logout,
        hasRole,
    } = useAuth();


    const canCreateProcedure = hasRole("Admin");
    const canAccessAdmin = hasRole("Admin");

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ""
            }`}>
            <div className={styles.top}>
                <div className={styles.brand}>
                    <BookOpen size={18} />

                    <span>RapidWiki</span>
                </div>

                <nav className={styles.navigation}>
                    <NavLink
                        to="/"
                        end
                        onClick={onClose}
                        className={({ isActive }) =>
                            `${styles.navItem} ${isActive ? styles.active : ""
                            }`
                        }
                    >
                        <Home size={16} />
                        <span>Início</span>
                    </NavLink>

                    <div className={styles.section}>
                        {departmentsMock.map((department) => (
                            <NavLink
                                key={department.id}
                                to={`/departments/${department.id}`}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `${styles.navItem} ${isActive ? styles.active : ""
                                    }`
                                }
                            >
                                {department.name}
                            </NavLink>
                        ))}
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
                        <span>Novo procedimento</span>
                    </NavLink>
                )}

                {canAccessAdmin && (
                    <NavLink
                        to="/admin"
                        onClick={onClose}
                        className={({ isActive }) =>
                            `${styles.navItem} ${isActive ? styles.active : ""
                            }`
                        }
                    >
                        <Settings size={16} />
                        <span>Administração</span>
                    </NavLink>
                )}
                <ThemeToggle />
                <button
                    className={styles.navItem}
                    onClick={handleLogout}
                >
                    <LogOut size={16} />
                    <span>Sair</span>
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
                        <strong>{user?.name}</strong>

                        <span>
                            {user?.roles.join(", ")}
                        </span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
