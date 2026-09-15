import {
    useEffect,
    useState,
} from "react";

import {
    FilePenLine,
    LoaderCircle,
} from "lucide-react";

import {
    Navigate,
} from "react-router";

import { ProcedureItem } from "@/components/ProcedureItem/ProcedureItem";

import {
    getDraftProcedures,
} from "@/services/procedureService";

import { useAuth } from "@/hooks/useAuth";

import type { Procedure } from "@/types/Procedure";

import styles from "./Drafts.module.css";


export function Drafts() {
    const { hasRole } =
        useAuth();


    const canViewDrafts =
        hasRole("Admin") ||
        hasRole("Editor");


    const [procedures, setProcedures] =
        useState<Procedure[]>([]);


    const [page, setPage] =
        useState(1);


    const [totalPages, setTotalPages] =
        useState(1);


    const [totalItems, setTotalItems] =
        useState(0);


    const [loadingPage, setLoadingPage] =
        useState<number | null>(
            null
        );


    const [error, setError] =
        useState("");


    const loading =
        loadingPage !== page;


    useEffect(() => {
        let ignore = false;


        async function loadDrafts() {
            try {
                const result =
                    await getDraftProcedures(
                        page
                    );


                if (ignore) {
                    return;
                }


                setProcedures(
                    result.items
                );

                setTotalPages(
                    result.totalPages
                );

                setTotalItems(
                    result.totalItems
                );

                setError("");
            } catch (error) {
                console.error(
                    "Erro ao carregar rascunhos:",
                    error
                );


                if (ignore) {
                    return;
                }


                setProcedures([]);

                setError(
                    "Não foi possível carregar os rascunhos."
                );
            } finally {
                if (!ignore) {
                    setLoadingPage(
                        page
                    );
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
    ]);


    if (!canViewDrafts) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    return (
        <div
            className={
                styles.page
            }
        >
            <header
                className={
                    styles.header
                }
            >
                <div
                    className={
                        styles.title
                    }
                >
                    <FilePenLine
                        size={22}
                    />

                    <h1>
                        Rascunhos
                    </h1>
                </div>

                <p>
                    Procedimentos ainda não publicados.
                </p>
            </header>


            <div
                className={
                    styles.sectionHeader
                }
            >
                <span>
                    {totalItems} rascunho
                    {totalItems !== 1
                        ? "s"
                        : ""}
                </span>
            </div>


            {loading ? (
                <div
                    className={
                        styles.loading
                    }
                >
                    <LoaderCircle
                        size={22}
                        className={
                            styles.loadingIcon
                        }
                    />
                </div>
            ) : error ? (
                <div
                    className={
                        styles.empty
                    }
                >
                    {error}
                </div>
            ) : procedures.length >
              0 ? (
                <>
                    <div
                        className={
                            styles.procedureList
                        }
                    >
                        {procedures.map(
                            (
                                procedure
                            ) => (
                                <ProcedureItem
                                    key={
                                        procedure.id
                                    }
                                    procedure={
                                        procedure
                                    }
                                />
                            )
                        )}
                    </div>


                    {totalPages > 1 && (
                        <div
                            className={
                                styles.pagination
                            }
                        >
                            <button
                                type="button"
                                disabled={
                                    page ===
                                    1
                                }
                                onClick={() =>
                                    setPage(
                                        (
                                            current
                                        ) =>
                                            current -
                                            1
                                    )
                                }
                            >
                                Anterior
                            </button>

                            <span>
                                Página{" "}
                                {page} de{" "}
                                {
                                    totalPages
                                }
                            </span>

                            <button
                                type="button"
                                disabled={
                                    page ===
                                    totalPages
                                }
                                onClick={() =>
                                    setPage(
                                        (
                                            current
                                        ) =>
                                            current +
                                            1
                                    )
                                }
                            >
                                Próxima
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div
                    className={
                        styles.empty
                    }
                >
                    <FilePenLine
                        size={24}
                    />

                    <p>
                        Nenhum rascunho encontrado.
                    </p>
                </div>
            )}
        </div>
    );
}