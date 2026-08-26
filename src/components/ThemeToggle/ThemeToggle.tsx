import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/contexts/ThemeContext";

import styles from "./ThemeToggle.module.css";

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className={styles.button}
            onClick={toggleTheme}
            aria-label="Alterar tema"
        >
            {theme === "dark" ? (
                <Sun size={16} />
            ) : (
                <Moon size={16} />
            )}

            <span>Aparência</span>
        </button>
    );
}