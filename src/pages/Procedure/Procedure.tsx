import { useEffect, useState } from "react";
import { ChevronRight, Pencil } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, useParams } from "react-router";

import { getProcedureById } from "@/services/procedureService";
import type { Procedure as ProcedureType } from "@/types/Procedure";

import styles from "./Procedure.module.css";

export function Procedure() {
    const { procedureId } = useParams();

    const [procedure, setProcedure] =
        useState<ProcedureType | null>(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProcedure() {
            if (!procedureId) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const data = await getProcedureById(procedureId);

                setProcedure(data ?? null);
            } finally {
                setLoading(false);
            }
        }

        loadProcedure();
    }, [procedureId]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!procedure) {
        return <p>Procedimento não encontrado.</p>;
    }

    const canEdit = true;

    return (
        <article className={styles.page}>
            <div className={styles.breadcrumb}>
                <Link to="/">Início</Link>

                <ChevronRight size={14} />

                <Link to={`/departments/${procedure.departmentId}`}>
                    {procedure.departmentName}
                </Link>
            </div>

            <header className={styles.header}>
                <div>
                    <h1>{procedure.title}</h1>

                    <div className={styles.metadata}>
                        <span>{procedure.writerName}</span>
                        <span>·</span>
                        <span>{procedure.lastUpdate}</span>
                    </div>
                </div>

                {canEdit && (
                    <Link
                        to={`/procedures/${procedure.id}/edit`}
                        className={styles.editButton}
                    >
                        <Pencil size={14} />
                        Editar
                    </Link>
                )}
            </header>

            <div className={styles.divider} />

            <div className={styles.markdown}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {procedure.content}
                </ReactMarkdown>
            </div>
        </article>
    );
}