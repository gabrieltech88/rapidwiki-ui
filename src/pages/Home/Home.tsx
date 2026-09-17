import {
    useEffect,
    useState,
} from "react";

import {
    ChevronLeft,
    ChevronRight,
    Search,
} from "lucide-react";

import { ProcedureItem } from "@/components/ProcedureItem/ProcedureItem";

import {
    getHomeProcedures,
} from "@/services/procedureService";

import type { Procedure } from "@/types/Procedure";

import styles from "./Home.module.css";


export function Home() {
    const [search, setSearch] =
        useState("");

    const [page, setPage] =
        useState(1);

    const [procedures, setProcedures] =
        useState<Procedure[]>([]);

    const [totalItems, setTotalItems] =
        useState(0);

    const [totalPages, setTotalPages] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {
        const timeout =
            window.setTimeout(
                async () => {
                    setLoading(true);
                    setError("");

                    try {
                        const result =
                            await getHomeProcedures(
                                page,
                                search
                            );

                        setProcedures(
                            result.items
                        );

                        setTotalItems(
                            result.totalItems
                        );

                        setTotalPages(
                            result.totalPages
                        );
                    } catch (error) {
                        console.error(
                            "Erro ao carregar procedimentos:",
                            error
                        );

                        setProcedures([]);
                        setTotalItems(0);
                        setTotalPages(0);

                        setError(
                            "Não foi possível carregar os procedimentos."
                        );
                    } finally {
                        setLoading(false);
                    }
                },
                300
            );

        return () => {
            window.clearTimeout(
                timeout
            );
        };
    }, [
        page,
        search,
    ]);


    function handleSearchChange(
        value: string
    ) {
        setSearch(value);
        setPage(1);
    }


    function goToPreviousPage() {
        if (page <= 1) {
            return;
        }

        setPage(
            currentPage =>
                currentPage - 1
        );
    }


    function goToNextPage() {
        if (
            page >=
            totalPages
        ) {
            return;
        }

        setPage(
            currentPage =>
                currentPage + 1
        );
    }


    return (
        <div className={styles.home}>
            <header className={styles.header}>
                <h1>
                    Base de conhecimento
                </h1>

                <p>
                    Encontre procedimentos e documentação interna.
                </p>

                <div className={styles.search}>
                    <Search size={17} />

                    <input
                        type="text"
                        placeholder="Buscar procedimentos..."
                        value={search}
                        onChange={(event) =>
                            handleSearchChange(
                                event.target.value
                            )
                        }
                    />
                </div>

                {!loading &&
                    !error &&
                    totalPages > 1 && (
                        <div
                            className={
                                styles.pagination
                            }
                        >
                            <button
                                type="button"
                                className={
                                    styles.paginationButton
                                }
                                onClick={
                                    goToPreviousPage
                                }
                                disabled={
                                    page === 1
                                }
                                title="Página anterior"
                                aria-label="Página anterior"
                            >
                                <ChevronLeft
                                    size={16}
                                />
                            </button>

                            <div
                                className={
                                    styles.paginationInfo
                                }
                            >
                                <span>
                                    Página
                                </span>

                                <strong>
                                    {page}
                                </strong>

                                <span>
                                    de
                                </span>

                                <strong>
                                    {totalPages}
                                </strong>
                            </div>

                            <button
                                type="button"
                                className={
                                    styles.paginationButton
                                }
                                onClick={
                                    goToNextPage
                                }
                                disabled={
                                    page ===
                                    totalPages
                                }
                                title="Próxima página"
                                aria-label="Próxima página"
                            >
                                <ChevronRight
                                    size={16}
                                />
                            </button>
                        </div>
                    )}
            </header>

            <section className={styles.recent}>
                <div
                    className={
                        styles.sectionHeader
                    }
                >
                    <h2>
                        {search
                            ? "Resultados"
                            : "Procedimentos recentes"}
                    </h2>

                    {!loading &&
                        !error && (
                            <span>
                                {totalItems}{" "}
                                resultado
                                {totalItems !== 1 &&
                                    "s"}
                            </span>
                        )}
                </div>

                {loading ? (
                    <div
                        className={
                            styles.empty
                        }
                    >
                        <p>
                            Carregando...
                        </p>
                    </div>
                ) : error ? (
                    <div
                        className={
                            styles.empty
                        }
                    >
                        <p>
                            {error}
                        </p>
                    </div>
                ) : procedures.length >
                  0 ? (
                    <div
                        className={
                            styles.procedureList
                        }
                    >
                        {procedures.map(
                            procedure => (
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
                ) : (
                    <div
                        className={
                            styles.empty
                        }
                    >
                        <p>
                            Nenhum procedimento encontrado.
                        </p>

                        {search && (
                            <span>
                                Tente buscar por outro termo.
                            </span>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}