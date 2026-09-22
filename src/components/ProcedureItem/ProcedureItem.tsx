import type {
    Procedure,
    ProcedureStatusLabel,
} from "@/types/Procedure";

import { Link } from "react-router";

import styles from "./ProcedureItem.module.css";


interface ProcedureItemProps {
    procedure: Procedure;
}


function getStatusClass(
    status: ProcedureStatusLabel
) {
    switch (status) {
        case "Publicado":
            return styles.statusPublished;

        case "Rascunho":
            return styles.statusDraft;

        default:
            return styles.statusDefault;
    }
}


export function ProcedureItem({
    procedure,
}: ProcedureItemProps) {
    return (
        <Link
            to={`/procedures/${procedure.id}`}
            className={styles.link}
        >
            <article className={styles.procedure}>
                <div className={styles.titleRow}>
                    <h3>
                        {procedure.title}
                    </h3>

                    <span
                        className={`${styles.status} ${getStatusClass(
                            procedure.status
                        )}`}
                    >
                        <span className={styles.statusDot} />

                        {procedure.status}
                    </span>
                </div>

                <p className={styles.description}>
                    {procedure.description}
                </p>

                <div className={styles.metadata}>
                    <span>
                        Última atualização
                    </span>

                    <span>·</span>

                    <span>
                        {procedure.lastUpdate}
                    </span>
                </div>
            </article>
        </Link>
    );
}