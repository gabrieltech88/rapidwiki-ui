import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { Outlet } from "react-router";

import { Sidebar } from "@/components/Sidebar/Sidebar";

import styles from "./AppLayout.module.css";

export function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [sidebarOpen]);

    return (
        <div className={styles.layout}>
            <Sidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            <header className={styles.mobileHeader}>
                <button
                    className={styles.menuButton}
                    onClick={() => setSidebarOpen(true)}
                    aria-label="Abrir menu"
                >
                    <Menu size={20} />
                </button>

                <span className={styles.mobileBrand}>
                    RapidWiki
                </span>
            </header>

            <main className={styles.content}>
                <Outlet />
            </main>
        </div>
    );
}