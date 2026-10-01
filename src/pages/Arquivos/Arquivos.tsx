import {
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    LoaderCircle,
    Plus,
    Search,
    Trash2,
    X,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router";

import {
    deleteArquivo,
    downloadArquivo,
    getArquivos,
} from "@/services/arquivoService";

import {
    getDepartmentById,
} from "@/services/departmentService";

import {
    useAuth,
} from "@/hooks/useAuth";

import type {
    Arquivo,
} from "@/types/Arquivo";

import type {
    Department,
} from "@/types/Department";

import styles from "./Arquivos.module.css";


function formatFileSize(
    bytes: number
): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const kilobytes =
        bytes / 1024;

    if (kilobytes < 1024) {
        return `${kilobytes.toFixed(1)} KB`;
    }

    const megabytes =
        kilobytes / 1024;

    return `${megabytes.toFixed(1)} MB`;
}


function formatDate(
    date: string
): string {
    const parsedDate =
        new Date(date);

    if (
        Number.isNaN(
            parsedDate.getTime()
        )
    ) {
        return date;
    }

    return parsedDate.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }
    );
}


export function Arquivos() {
    const {
        departmentId,
    } = useParams();

    const {
        hasRole,
    } = useAuth();

    const [
        deletingId,
        setDeletingId,
    ] = useState<string | null>(null);

    const [
        department,
        setDepartment,
    ] = useState<Department | null>(null);

    const [
        arquivos,
        setArquivos,
    ] = useState<Arquivo[]>([]);

    const [
        page,
        setPage,
    ] = useState(1);

    const [
        totalPages,
        setTotalPages,
    ] = useState(1);

    const [
        totalItems,
        setTotalItems,
    ] = useState(0);

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        departmentLoading,
        setDepartmentLoading,
    ] = useState(true);

    const [
        downloadingId,
        setDownloadingId,
    ] = useState<string | null>(null);

    const [
        error,
        setError,
    ] = useState("");


    useEffect(() => {
        let ignore = false;

        async function loadDepartment() {
            if (!departmentId) {
                setDepartmentLoading(false);
                return;
            }

            setDepartmentLoading(true);

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
            } catch (error) {
                console.error(
                    "Erro ao carregar departamento:",
                    error
                );

                if (!ignore) {
                    setDepartment(null);
                }
            } finally {
                if (!ignore) {
                    setDepartmentLoading(false);
                }
            }
        }

        loadDepartment();

        return () => {
            ignore = true;
        };
    }, [
        departmentId,
    ]);


    useEffect(() => {
        let ignore = false;

        async function loadArquivos() {
            if (!departmentId) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const data =
                    await getArquivos(
                        page,
                        searchTerm,
                        departmentId
                    );

                if (ignore) {
                    return;
                }

                setArquivos(
                    data.items
                );

                setTotalPages(
                    Math.max(
                        data.totalPages,
                        1
                    )
                );

                setTotalItems(
                    data.totalItems
                );

                setError("");
            } catch (error) {
                console.error(
                    "Erro ao carregar arquivos:",
                    error
                );

                if (!ignore) {
                    setArquivos([]);
                    setTotalItems(0);

                    setError(
                        "Não foi possível carregar os arquivos."
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadArquivos();

        return () => {
            ignore = true;
        };
    }, [
        departmentId,
        page,
        searchTerm,
    ]);


    function handleSearch(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setPage(1);

        setSearchTerm(
            search.trim()
        );
    }


    function handleClearSearch() {
        setSearch("");
        setSearchTerm("");
        setPage(1);
    }


    async function handleDownload(
        arquivo: Arquivo
    ) {
        setDownloadingId(
            arquivo.id
        );

        setError("");

        try {
            await downloadArquivo(
                arquivo.id,
                arquivo.name
            );
        } catch (error) {
            console.error(
                "Erro ao baixar arquivo:",
                error
            );

            setError(
                "Não foi possível baixar o arquivo."
            );
        } finally {
            setDownloadingId(
                null
            );
        }
    }


    async function handleDelete(
        arquivo: Arquivo
    ) {
        const confirmed =
            window.confirm(
                `Deseja excluir o arquivo "${arquivo.name}"? Essa ação não poderá ser desfeita.`
            );

        if (!confirmed) {
            return;
        }

        setDeletingId(
            arquivo.id
        );

        setError("");

        try {
            await deleteArquivo(
                arquivo.id
            );

            const isLastItemOnPage =
                arquivos.length === 1;

            if (
                isLastItemOnPage &&
                page > 1
            ) {
                setPage(
                    (current) =>
                        current - 1
                );

                return;
            }

            setArquivos(
                (current) =>
                    current.filter(
                        (item) =>
                            item.id !==
                            arquivo.id
                    )
            );

            setTotalItems(
                (current) =>
                    Math.max(
                        current - 1,
                        0
                    )
            );

            setTotalPages(
                () =>
                    Math.max(
                        Math.ceil(
                            (totalItems - 1) / 8
                        ),
                        1
                    )
            );
        } catch (error) {
            console.error(
                "Erro ao excluir arquivo:",
                error
            );

            setError(
                "Não foi possível excluir o arquivo."
            );
        } finally {
            setDeletingId(
                null
            );
        }
    }


    if (
        departmentLoading
    ) {
        return (
            <div
                className={
                    styles.loadingPage
                }
            >
                <LoaderCircle
                    size={24}
                    className={
                        styles.spinner
                    }
                />
            </div>
        );
    }


    if (
        !departmentId ||
        !department
    ) {
        return (
            <div
                className={
                    styles.page
                }
            >
                <div
                    className={
                        styles.empty
                    }
                >
                    <FileText
                        size={30}
                    />

                    <h2>
                        Departamento não encontrado
                    </h2>

                    <p>
                        Não foi possível localizar o departamento informado.
                    </p>
                </div>
            </div>
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
                        styles.headerContent
                    }
                >
                    <span
                        className={
                            styles.departmentName
                        }
                    >
                        {department.name}
                    </span>

                    <h1>
                        Arquivos
                    </h1>

                    <p>
                        Arquivos e documentos disponíveis para este departamento.
                    </p>
                </div>

                {hasRole("Admin") && (
                    <Link
                        to="/arquivos/novo"
                        className={
                            styles.createButton
                        }
                    >
                        <Plus
                            size={17}
                        />

                        <span>
                            Adicionar arquivo
                        </span>
                    </Link>
                )}
            </header>


            <div
                className={
                    styles.toolbar
                }
            >
                <form
                    className={
                        styles.searchForm
                    }
                    onSubmit={
                        handleSearch
                    }
                >
                    <Search
                        size={18}
                        className={
                            styles.searchIcon
                        }
                    />

                    <input
                        type="search"
                        value={
                            search
                        }
                        onChange={(
                            event
                        ) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Buscar arquivos..."
                    />

                    {search && (
                        <button
                            type="button"
                            className={
                                styles.clearSearch
                            }
                            onClick={
                                handleClearSearch
                            }
                            aria-label="Limpar busca"
                        >
                            <X
                                size={16}
                            />
                        </button>
                    )}
                </form>

                <div
                    className={
                        styles.resultCount
                    }
                >
                    <strong>
                        {totalItems}
                    </strong>

                    <span>
                        {totalItems === 1
                            ? "arquivo"
                            : "arquivos"}
                    </span>
                </div>
            </div>


            {searchTerm && (
                <div
                    className={
                        styles.searchResult
                    }
                >
                    Resultados para

                    <strong>
                        "{searchTerm}"
                    </strong>

                    <button
                        type="button"
                        onClick={
                            handleClearSearch
                        }
                    >
                        Limpar busca
                    </button>
                </div>
            )}


            {loading ? (
                <div
                    className={
                        styles.loading
                    }
                >
                    <LoaderCircle
                        size={22}
                        className={
                            styles.spinner
                        }
                    />

                    <span>
                        Carregando arquivos...
                    </span>
                </div>
            ) : error ? (
                <div
                    className={
                        styles.error
                    }
                >
                    {error}
                </div>
            ) : arquivos.length === 0 ? (
                <div
                    className={
                        styles.empty
                    }
                >
                    <div
                        className={
                            styles.emptyIcon
                        }
                    >
                        <FileText
                            size={26}
                        />
                    </div>

                    <h2>
                        {searchTerm
                            ? "Nenhum arquivo encontrado"
                            : "Nenhum arquivo cadastrado"}
                    </h2>

                    <p>
                        {searchTerm
                            ? "Tente buscar utilizando outro termo."
                            : "Ainda não existem arquivos disponíveis neste departamento."}
                    </p>
                </div>
            ) : (
                <div
                    className={
                        styles.fileList
                    }
                >
                    {arquivos.map(
                        (
                            arquivo
                        ) => (
                            <article
                                key={
                                    arquivo.id
                                }
                                className={
                                    styles.fileCard
                                }
                            >
                                <div
                                    className={
                                        styles.fileIcon
                                    }
                                >
                                    <FileText
                                        size={22}
                                    />
                                </div>

                                <div
                                    className={
                                        styles.fileContent
                                    }
                                >
                                    <div
                                        className={
                                            styles.fileHeading
                                        }
                                    >
                                        <strong
                                            className={
                                                styles.fileName
                                            }
                                        >
                                            {
                                                arquivo.name
                                            }
                                        </strong>

                                        <span
                                            className={
                                                styles.fileType
                                            }
                                        >
                                            {
                                                arquivo.type.toUpperCase()
                                            }
                                        </span>
                                    </div>

                                    <div
                                        className={
                                            styles.fileMetadata
                                        }
                                    >
                                        <span>
                                            {
                                                formatFileSize(
                                                    arquivo.sizeBytes
                                                )
                                            }
                                        </span>

                                        <span
                                            className={
                                                styles.metadataDivider
                                            }
                                        />

                                        <span>
                                            Adicionado em{" "}
                                            {
                                                formatDate(
                                                    arquivo.createdAt
                                                )
                                            }
                                        </span>
                                    </div>

                                    {hasRole("Admin") &&
                                        arquivo.departments.length >
                                            0 && (
                                            <div
                                                className={
                                                    styles.departments
                                                }
                                            >
                                                {arquivo.departments.map(
                                                    (
                                                        department
                                                    ) => (
                                                        <span
                                                            key={
                                                                department.id
                                                            }
                                                            className={
                                                                styles.departmentBadge
                                                            }
                                                        >
                                                            {
                                                                department.name
                                                            }
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        )}
                                </div>

                                <div
                                    className={
                                        styles.fileActions
                                    }
                                >
                                    <button
                                        type="button"
                                        className={
                                            styles.downloadButton
                                        }
                                        disabled={
                                            downloadingId ===
                                            arquivo.id
                                        }
                                        onClick={() =>
                                            handleDownload(
                                                arquivo
                                            )
                                        }
                                        aria-label={`Baixar ${arquivo.name}`}
                                    >
                                        {downloadingId ===
                                        arquivo.id ? (
                                            <LoaderCircle
                                                size={17}
                                                className={
                                                    styles.spinner
                                                }
                                            />
                                        ) : (
                                            <Download
                                                size={17}
                                            />
                                        )}

                                        <span>
                                            Baixar
                                        </span>
                                    </button>

                                    {hasRole("Admin") && (
                                        <button
                                            type="button"
                                            className={
                                                styles.deleteButton
                                            }
                                            disabled={
                                                deletingId ===
                                                arquivo.id
                                            }
                                            onClick={() =>
                                                handleDelete(
                                                    arquivo
                                                )
                                            }
                                            aria-label={`Excluir ${arquivo.name}`}
                                        >
                                            {deletingId ===
                                            arquivo.id ? (
                                                <LoaderCircle
                                                    size={17}
                                                    className={
                                                        styles.spinner
                                                    }
                                                />
                                            ) : (
                                                <Trash2
                                                    size={17}
                                                />
                                            )}

                                            <span>
                                                Excluir
                                            </span>
                                        </button>
                                    )}
                                </div>
                            </article>
                        )
                    )}
                </div>
            )}


            {!loading &&
                !error &&
                totalPages > 1 && (
                    <div
                        className={
                            styles.pagination
                        }
                    >
                        <span
                            className={
                                styles.paginationInfo
                            }
                        >
                            Página{" "}
                            <strong>
                                {page}
                            </strong>{" "}
                            de{" "}
                            <strong>
                                {totalPages}
                            </strong>
                        </span>

                        <div
                            className={
                                styles.paginationActions
                            }
                        >
                            <button
                                type="button"
                                disabled={
                                    page === 1
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
                                aria-label="Página anterior"
                            >
                                <ChevronLeft
                                    size={17}
                                />

                                Anterior
                            </button>

                            <button
                                type="button"
                                disabled={
                                    page >=
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
                                aria-label="Próxima página"
                            >
                                Próxima

                                <ChevronRight
                                    size={17}
                                />
                            </button>
                        </div>
                    </div>
                )}
        </div>
    );
}