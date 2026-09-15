import { LoaderCircle } from "lucide-react";

import styles from "./LoadingScreen.module.css";


export function LoadingScreen() {
    return (
        <div
            className={styles.loading}
            role="status"
            aria-label="Carregando"
        >
            <LoaderCircle
                className={styles.icon}
                size={24}
            />
        </div>
    );
}