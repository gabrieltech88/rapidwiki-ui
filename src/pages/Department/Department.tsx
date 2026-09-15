import {
    ChevronLeft,
    ChevronRight,
    FileText,
    LoaderCircle,
    Search,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import { useParams } from "react-router";

import { ProcedureItem } from "@/components/ProcedureItem/ProcedureItem";

import { getDepartmentById } from "@/services/departmentService";
import { getProceduresByDepartment } from "@/services/procedureService";

import type { Department as DepartmentType } from "@/types/Department";
import type { Procedure } from "@/types/Procedure";

import styles from "./Department.module.css";


type DepartmentSection =
    | "procedures"
    | "documents";


interface DepartmentProps {
    section: DepartmentSection;
}


interface ProcedureFilters {
    departmentId?: string;
    search: string;
    debouncedSearch: string;
    page: number;
}


export function Department({
    section,
}: DepartmentProps) {
    const { departmentId } =
        useParams();


    const [department, setDepartment] =
        useState<DepartmentType | null>(
            null
        );


    const [procedures, setProcedures] =
        useState<Procedure[]>([]);


    const [filters, setFilters] =
        useState<ProcedureFilters>({
            departmentId,
            search: "",
            debouncedSearch: "",
            page: 1,
        });


    const currentFilters =
        filters.departmentId === departmentId
            ? filters
            : {
                  departmentId,
                  search: "",
                  debouncedSearch: "",
                  page: 1,
              };


    const {
        search,
        debouncedSearch,
        page,
    } = currentFilters;


    const [totalItems, setTotalItems] =
        useState(0);


    const [totalPages, setTotalPages] =
        useState(0);


    const [
        loadingDepartment,
        setLoadingDepartment,
    ] = useState(true);


    const [
        loadingProcedures,
        setLoadingProcedures,
    ] = useState(false);


    const [error, setError] =
        useState("");


    useEffect(() => {
        let ignore = false;


        async function loadDepartment() {
            if (!departmentId) {
                return;
            }


            setLoadingDepartment(true);


            try {
                const data =
                    await getDepartmentById(
                        departmentId
                    );


                if (!ignore) {
                    setDepartment(
                        data ?? null
                    );
                }
            } catch {
                if (!ignore) {
                    setDepartment(null);
                }
            } finally {
                if (!ignore) {
                    setLoadingDepartment(
                        false
                    );
                }
            }
        }


        loadDepartment();


        return () => {
            ignore = true;
        };
    }, [departmentId]);


    useEffect(() => {
        const timeout =
            window.setTimeout(() => {
                setFilters(
                    (current) => {
                        if (
                            current.departmentId !==
                            departmentId
                        ) {
                            return {
                                departmentId,
                                search: "",
                                debouncedSearch: "",
                                page: 1,
                            };
                        }


                        const normalizedSearch =
                            current.search.trim();


                        if (
                            current.debouncedSearch ===
                            normalizedSearch
                        ) {
                            return current;
                        }


                        return {
                            ...current,
                            debouncedSearch:
                                normalizedSearch,
                            page: 1,
                        };
                    }
                );
            }, 400);


        return () => {
            window.clearTimeout(
                timeout
            );
        };
    }, [
        departmentId,
        search,
    ]);


    useEffect(() => {
        let ignore = false;


        async function loadProcedures() {
            if (
                !departmentId ||
                section !== "procedures"
            ) {
                return;
            }


            setLoadingProcedures(true);
            setError("");


            try {
                const data =
                    await getProceduresByDepartment(
                        departmentId,
                        page,
                        debouncedSearch
                    );


                if (ignore) {
                    return;
                }


                setProcedures(
                    data.items
                );


                setTotalItems(
                    data.totalItems
                );


                setTotalPages(
                    data.totalPages
                );
            } catch (error) {
                console.error(
                    "Erro ao carregar procedimentos:",
                    error
                );


                if (ignore) {
                    return;
                }


                setProcedures([]);
                setTotalItems(0);
                setTotalPages(0);


                setError(
                    "Não foi possível carregar os procedimentos."
                );
            } finally {
                if (!ignore) {
                    setLoadingProcedures(
                        false
                    );
                }
            }
        }


        loadProcedures();


        return () => {
            ignore = true;
        };
    }, [
        departmentId,
        section,
        page,
        debouncedSearch,
    ]);


    function handleSearchChange(
        value: string
    ) {
        setFilters(
            (current) => ({
                departmentId,
                search: value,

                debouncedSearch:
                    current.departmentId ===
                    departmentId
                        ? current.debouncedSearch
                        : "",

                page: 1,
            })
        );
    }


    function handlePreviousPage() {
        if (
            page <= 1 ||
            loadingProcedures
        ) {
            return;
        }


        setFilters(
            (current) => ({
                ...current,
                departmentId,
                page: page - 1,
            })
        );
    }


    function handleNextPage() {
        if (
            page >= totalPages ||
            loadingProcedures
        ) {
            return;
        }


        setFilters(
            (current) => ({
                ...current,
                departmentId,
                page: page + 1,
            })
        );
    }


    if (loadingDepartment) {
        return (
            <div className={styles.loading}>
                <LoaderCircle
                    size={22}
                    className={
                        styles.loadingIcon
                    }
                />
            </div>
        );
    }


    if (!department) {
        return (
            <div className={styles.empty}>
                <p>
                    Departamento não encontrado.
                </p>
            </div>
        );
    }


    return (
        <div className={styles.department}>
            <header className={styles.header}>
                <h1>
                    {department.name}
                </h1>

                <p>
                    Procedimentos e documentação
                    deste departamento.
                </p>
            </header>


            {section === "procedures" ? (
                <section>
                    <div
                        className={
                            styles.sectionTop
                        }
                    >
                        <div
                            className={
                                styles.sectionHeader
                            }
                        >
                            <h2>
                                Procedimentos
                            </h2>


                            {!loadingProcedures && (
                                <span>
                                    {totalItems}{" "}
                                    procedimento
                                    {totalItems !== 1 &&
                                        "s"}
                                </span>
                            )}
                        </div>


                        <div
                            className={
                                styles.search
                            }
                        >
                            <Search
                                size={16}
                            />


                            <input
                                type="search"
                                placeholder="Pesquisar procedimentos..."
                                value={search}
                                onChange={(
                                    event
                                ) =>
                                    handleSearchChange(
                                        event.target.value
                                    )
                                }
                                aria-label="Pesquisar procedimentos"
                            />


                            {loadingProcedures && (
                                <LoaderCircle
                                    size={16}
                                    className={
                                        styles.loadingIcon
                                    }
                                />
                            )}
                        </div>
                    </div>


                    {totalPages > 1 && (
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
                                    handlePreviousPage
                                }
                                disabled={
                                    page === 1 ||
                                    loadingProcedures
                                }
                            >
                                <ChevronLeft
                                    size={16}
                                />

                                <span>
                                    Anterior
                                </span>
                            </button>


                            <span
                                className={
                                    styles.pageInfo
                                }
                            >
                                {page} de{" "}
                                {totalPages}
                            </span>


                            <button
                                type="button"
                                className={
                                    styles.paginationButton
                                }
                                onClick={
                                    handleNextPage
                                }
                                disabled={
                                    page ===
                                        totalPages ||
                                    loadingProcedures
                                }
                            >
                                <span>
                                    Próxima
                                </span>

                                <ChevronRight
                                    size={16}
                                />
                            </button>
                        </div>
                    )}


                    {error ? (
                        <div
                            className={
                                styles.empty
                            }
                        >
                            <p>
                                {error}
                            </p>
                        </div>
                    ) : loadingProcedures &&
                      procedures.length === 0 ? (
                        <div
                            className={
                                styles.loadingResults
                            }
                        >
                            <LoaderCircle
                                size={22}
                                className={
                                    styles.loadingIcon
                                }
                            />
                        </div>
                    ) : procedures.length > 0 ? (
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
                    ) : (
                        <div
                            className={
                                styles.empty
                            }
                        >
                            <p>
                                {debouncedSearch
                                    ? "Nenhum procedimento encontrado para esta pesquisa."
                                    : "Nenhum procedimento neste departamento."}
                            </p>
                        </div>
                    )}
                </section>
            ) : (
                <section>
                    <div
                        className={
                            styles.sectionHeader
                        }
                    >
                        <h2>
                            Documentos
                        </h2>
                    </div>


                    <div
                        className={
                            styles.documentsEmpty
                        }
                    >
                        <FileText
                            size={20}
                        />

                        <p>
                            Nenhum documento neste
                            departamento.
                        </p>
                    </div>
                </section>
            )}
        </div>
    );
}