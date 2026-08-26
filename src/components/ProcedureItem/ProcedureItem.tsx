import type { Procedure } from "@/types/Procedure";
import { Link } from "react-router";
import styles from "./ProcedureItem.module.css";

interface ProcedureItemProps {
    procedure: Procedure;
}

export function ProcedureItem({ procedure }: ProcedureItemProps) {
    return (
        <Link
            to={`/procedures/${procedure.id}`}
            className={styles.link}
        >
            <article className={styles.procedure}>
                <h3>{procedure.title}</h3>

                <p className={styles.description}>
                    {procedure.description}
                </p>

                <div className={styles.metadata}>
                    <span>{procedure.departmentName}</span>
                    <span>·</span>
                    <span>{procedure.lastUpdate}</span>
                </div>
            </article>
        </Link>
    );
}