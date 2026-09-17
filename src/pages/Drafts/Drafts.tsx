import { useEffect, useState } from "react";

import {
    FilePenLine,
    LoaderCircle,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    Link,
    Navigate,
} from "react-router";

import {
    deleteDraft,
    getDraftProcedures,
} from "@/services/procedureService";

import type {
    DraftProcedure,
} from "@/services/procedureService";

import { useAuth } from "@/hooks/useAuth";

import styles from "./Drafts.module.css";


export function Drafts() {
    const { hasRole } = useAuth();

    const canViewDrafts =
        hasRole("Admin") ||
        hasRole("Editor");

    const [drafts, setDrafts] = useState<DraftProcedure[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [error, setError] = useState("");


    useEffect(() => {
        let ignore = false;

        async function loadDrafts() {
            setLoading(true);

            try {
                const result = await getDraftProcedures(page);

                if (ignore) {
                    return;
                }

                setDrafts(result.items);
                setTotalPages(result.totalPages);
                setTotalItems(result.totalItems);
                setError("");
            } catch (error) {
                console.error("Erro ao carregar rascunhos:", error);

                if (ignore) {
                    return;
                }

                setDrafts([]);
                setError("Não foi possível carregar os rascunhos.");
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        if (canViewDrafts) {
            loadDrafts();
        }

        return () => {
            ignore = true;
        };
    }, [
        page,
        canViewDrafts,
        reloadKey,
    ]);


    async function handleDeleteDraft(draft: DraftProcedure) {
        const message = draft.hasPublishedVersion
            ? `Descartar as alterações não publicadas de "${draft.title}"? A versão publicada será mantida.`
            : `Excluir o rascunho "${draft.title}"? Essa ação não poderá ser desfeita.`;

        const confirmed = window.confirm(message);

        if (!confirmed) {
            return;
        }

        setDeletingId(draft.id);

        try {
            await deleteDraft(draft.id);

            if (drafts.length === 1 && page > 1) {
                setPage((current) => current - 1);
            } else {
                setReloadKey((current) => current + 1);
            }
        } catch (error) {
            console.error("Erro ao excluir rascunho:", error);
            window.alert("Não foi possível excluir o rascunho.");
        } finally {
            setDeletingId(null);
        }
    }


    if (!canViewDrafts) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div className={styles.title}>
                    <FilePenLine size={22} />

                    <h1>
                        Rascunhos
                    </h1>
                </div>

                <p>
                    Procedimentos ainda não publicados e alterações aguardando publicação.
                </p>
            </header>


            <div className={styles.sectionHeader}>
                <span>
                    {totalItems} rascunho
                    {totalItems !== 1 ? "s" : ""}
                </span>
            </div>


            {loading ? (
                <div className={styles.loading}>
                    <LoaderCircle
                        size={22}
                        className={styles.loadingIcon}
                    />
                </div>
            ) : error ? (
                <div className={styles.empty}>
                    {error}
                </div>
            ) : drafts.length > 0 ? (
                <>
                    <div className={styles.draftList}>
                        {drafts.map((draft) => (
                            <article
                                key={draft.id}
                                className={styles.draftItem}
                            >
                                <div className={styles.draftContent}>
                                    <div className={styles.draftTop}>
                                        <h2>
                                            {draft.title}
                                        </h2>

                                        <span
                                            className={
                                                draft.hasPublishedVersion
                                                    ? styles.revisionBadge
                                                    : styles.newBadge
                                            }
                                        >
                                            {draft.hasPublishedVersion
                                                ? "Alterações não publicadas"
                                                : "Ainda não publicado"}
                                        </span>
                                    </div>

                                    {draft.description && (
                                        <p className={styles.description}>
                                            {draft.description}
                                        </p>
                                    )}

                                    <div className={styles.metadata}>
                                        <span>
                                            Autor: {draft.authorName}
                                        </span>

                                        <span>
                                            ·
                                        </span>

                                        <span>
                                            Última edição: {draft.editorName}
                                        </span>

                                        <span>
                                            ·
                                        </span>

                                        <span>
                                            {draft.lastUpdate}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.draftActions}>
                                    <Link
                                        to={`/procedures/${draft.id}/edit`}
                                        className={styles.editButton}
                                    >
                                        <Pencil size={14} />
                                        Editar
                                    </Link>

                                    <button
                                        type="button"
                                        className={styles.deleteButton}
                                        onClick={() => handleDeleteDraft(draft)}
                                        disabled={deletingId === draft.id}
                                    >
                                        <Trash2 size={14} />
                                        {deletingId === draft.id
                                            ? "Excluindo..."
                                            : draft.hasPublishedVersion
                                                ? "Descartar"
                                                : "Excluir"}
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>


                    {totalPages > 1 && (
                        <div className={styles.pagination}>
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() =>
                                    setPage((current) => current - 1)
                                }
                            >
                                Anterior
                            </button>

                            <span>
                                Página {page} de {totalPages}
                            </span>

                            <button
                                type="button"
                                disabled={page === totalPages}
                                onClick={() =>
                                    setPage((current) => current + 1)
                                }
                            >
                                Próxima
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className={styles.empty}>
                    <FilePenLine size={24} />

                    <p>
                        Nenhum rascunho encontrado.
                    </p>
                </div>
            )}
        </div>
    );
}
