import {
    ArrowLeft,
    Check,
    FileText,
    LoaderCircle,
    Upload,
    X,
} from "lucide-react";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Link,
    Navigate,
    useSearchParams,
} from "react-router";

import {
    getDepartmentsForProcedure,
} from "@/services/departmentService";

import {
    uploadArquivo,
} from "@/services/arquivoService";

import {
    useAuth,
} from "@/hooks/useAuth";

import type {
    Department,
} from "@/types/Department";

import styles from "./ArquivoForm.module.css";


const MAX_FILE_SIZE =
    50 * 1024 * 1024;

const ALLOWED_EXTENSIONS = [
    "txt",
    "cfg",
    "conf",
    "ini",
    "log",
    "json",
    "xml",
    "yaml",
    "yml",
    "csv",
    "pdf",
    "docx",
    "xlsx",
];


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

    return `${(
        kilobytes / 1024
    ).toFixed(1)} MB`;
}


export function ArquivoForm() {
    const {
        hasRole,
    } = useAuth();

    const [
        searchParams,
    ] = useSearchParams();

    const inputRef =
        useRef<HTMLInputElement | null>(
            null
        );

    const departmentId =
        searchParams.get(
            "departmentId"
        );

    const [
        file,
        setFile,
    ] = useState<File | null>(
        null
    );

    const [
        departments,
        setDepartments,
    ] = useState<Department[]>([]);

    const [
        selectedDepartmentIds,
        setSelectedDepartmentIds,
    ] = useState<string[]>([]);

    const [
        dragActive,
        setDragActive,
    ] = useState(false);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const [
        success,
        setSuccess,
    ] = useState("");


    useEffect(() => {
        let ignore = false;

        async function loadDepartments() {
            try {
                const data =
                    await getDepartmentsForProcedure();

                if (ignore) {
                    return;
                }

                setDepartments(data);

                if (
                    departmentId &&
                    data.some(
                        (department) =>
                            department.id ===
                            departmentId
                    )
                ) {
                    setSelectedDepartmentIds(
                        [departmentId]
                    );
                }
            } catch (error) {
                console.error(
                    "Erro ao carregar departamentos:",
                    error
                );

                if (!ignore) {
                    setError(
                        "Não foi possível carregar os departamentos."
                    );
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadDepartments();

        return () => {
            ignore = true;
        };
    }, [
        departmentId,
    ]);


    function validateFile(
        selectedFile: File
    ): boolean {
        if (
            selectedFile.size >
            MAX_FILE_SIZE
        ) {
            setError(
                "O arquivo deve possuir no máximo 50 MB."
            );

            return false;
        }

        const extension =
            selectedFile.name
                .split(".")
                .pop()
                ?.toLowerCase();

        if (
            !extension ||
            !ALLOWED_EXTENSIONS.includes(
                extension
            )
        ) {
            setError(
                "Formato de arquivo não permitido."
            );

            return false;
        }

        setError("");
        setSuccess("");

        return true;
    }


    function selectFile(
        selectedFile: File | null
    ) {
        if (!selectedFile) {
            return;
        }

        if (
            !validateFile(
                selectedFile
            )
        ) {
            return;
        }

        setFile(
            selectedFile
        );
    }


    function handleDrop(
        event: React.DragEvent<HTMLDivElement>
    ) {
        event.preventDefault();

        setDragActive(false);

        selectFile(
            event.dataTransfer.files?.[0] ??
                null
        );
    }


    function handleDepartmentToggle(
        selectedId: string
    ) {
        setSelectedDepartmentIds(
            (current) =>
                current.includes(
                    selectedId
                )
                    ? current.filter(
                          (id) =>
                              id !==
                              selectedId
                      )
                    : [
                          ...current,
                          selectedId,
                      ]
        );

        setError("");
        setSuccess("");
    }


    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        if (!file) {
            setError(
                "Selecione um arquivo."
            );

            return;
        }

        if (
            selectedDepartmentIds.length ===
            0
        ) {
            setError(
                "Selecione pelo menos um departamento."
            );

            return;
        }

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            await uploadArquivo(
                file,
                selectedDepartmentIds
            );

            setSuccess(
                "Arquivo enviado com sucesso."
            );

            setFile(null);

            if (departmentId) {
                setSelectedDepartmentIds(
                    [departmentId]
                );
            } else {
                setSelectedDepartmentIds(
                    []
                );
            }

            if (
                inputRef.current
            ) {
                inputRef.current.value =
                    "";
            }
        } catch (error) {
            console.error(
                "Erro ao enviar arquivo:",
                error
            );

            setError(
                "Não foi possível enviar o arquivo."
            );
        } finally {
            setSaving(false);
        }
    }


    if (!hasRole("Admin")) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }


    if (loading) {
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


    const backPath =
        departmentId
            ? `/departments/${departmentId}/arquivos`
            : "/";


    return (
        <div
            className={
                styles.page
            }
        >
            <Link
                to={backPath}
                className={
                    styles.back
                }
            >
                <ArrowLeft
                    size={15}
                />

                Voltar
            </Link>

            <header
                className={
                    styles.header
                }
            >
                <h1>
                    Adicionar arquivo
                </h1>

                <p>
                    Envie documentos e arquivos que ficarão disponíveis na base de conhecimento.
                </p>
            </header>

            <form
                className={
                    styles.form
                }
                onSubmit={
                    handleSubmit
                }
            >
                <section
                    className={
                        styles.card
                    }
                >
                    <div
                        className={
                            styles.sectionHeader
                        }
                    >
                        <div>
                            <h2>
                                Arquivo
                            </h2>

                            <p>
                                Selecione ou arraste o arquivo que deseja enviar.
                            </p>
                        </div>
                    </div>

                    {!file ? (
                        <div
                            className={`${styles.dropZone} ${
                                dragActive
                                    ? styles.dropZoneActive
                                    : ""
                            }`}
                            onClick={() =>
                                inputRef.current?.click()
                            }
                            onDragEnter={(
                                event
                            ) => {
                                event.preventDefault();
                                setDragActive(
                                    true
                                );
                            }}
                            onDragOver={(
                                event
                            ) => {
                                event.preventDefault();
                                setDragActive(
                                    true
                                );
                            }}
                            onDragLeave={() =>
                                setDragActive(
                                    false
                                )
                            }
                            onDrop={
                                handleDrop
                            }
                        >
                            <div
                                className={
                                    styles.uploadIcon
                                }
                            >
                                <Upload
                                    size={24}
                                />
                            </div>

                            <strong>
                                Arraste um arquivo para cá
                            </strong>

                            <span>
                                ou clique para selecionar
                            </span>

                            <small>
                                Tamanho máximo de 50 MB
                            </small>
                        </div>
                    ) : (
                        <div
                            className={
                                styles.selectedFile
                            }
                        >
                            <div
                                className={
                                    styles.fileIcon
                                }
                            >
                                <FileText
                                    size={23}
                                />
                            </div>

                            <div
                                className={
                                    styles.fileInfo
                                }
                            >
                                <strong>
                                    {file.name}
                                </strong>

                                <span>
                                    {formatFileSize(
                                        file.size
                                    )}
                                </span>
                            </div>

                            <button
                                type="button"
                                className={
                                    styles.removeFile
                                }
                                onClick={() => {
                                    setFile(
                                        null
                                    );

                                    if (
                                        inputRef.current
                                    ) {
                                        inputRef.current.value =
                                            "";
                                    }
                                }}
                                aria-label="Remover arquivo"
                            >
                                <X
                                    size={17}
                                />
                            </button>
                        </div>
                    )}

                    <input
                        ref={inputRef}
                        type="file"
                        className={
                            styles.hiddenInput
                        }
                        accept={ALLOWED_EXTENSIONS.map(
                            (extension) =>
                                `.${extension}`
                        ).join(",")}
                        onChange={(
                            event
                        ) =>
                            selectFile(
                                event.target.files?.[0] ??
                                    null
                            )
                        }
                    />

                    <div
                        className={
                            styles.formats
                        }
                    >
                        <span>
                            Formatos aceitos:
                        </span>

                        <p>
                            TXT, CFG, CONF, INI, LOG, JSON, XML, YAML, CSV, PDF, DOCX e XLSX
                        </p>
                    </div>
                </section>

                <section
                    className={
                        styles.card
                    }
                >
                    <div
                        className={
                            styles.sectionHeader
                        }
                    >
                        <div>
                            <h2>
                                Departamentos
                            </h2>

                            <p>
                                Defina quais departamentos poderão visualizar este arquivo.
                            </p>
                        </div>

                        <span
                            className={
                                styles.selectedCount
                            }
                        >
                            {
                                selectedDepartmentIds.length
                            } selecionado
                            {selectedDepartmentIds.length !==
                            1
                                ? "s"
                                : ""}
                        </span>
                    </div>

                    <div
                        className={
                            styles.departmentGrid
                        }
                    >
                        {departments.map(
                            (
                                department
                            ) => {
                                const selected =
                                    selectedDepartmentIds.includes(
                                        department.id
                                    );

                                return (
                                    <button
                                        key={
                                            department.id
                                        }
                                        type="button"
                                        className={`${styles.departmentOption} ${
                                            selected
                                                ? styles.departmentOptionSelected
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleDepartmentToggle(
                                                department.id
                                            )
                                        }
                                    >
                                        <span
                                            className={
                                                styles.checkbox
                                            }
                                        >
                                            {selected && (
                                                <Check
                                                    size={14}
                                                />
                                            )}
                                        </span>

                                        <span>
                                            {
                                                department.name
                                            }
                                        </span>
                                    </button>
                                );
                            }
                        )}
                    </div>
                </section>

                {error && (
                    <div
                        className={
                            styles.error
                        }
                    >
                        {error}
                    </div>
                )}

                {success && (
                    <div
                        className={
                            styles.success
                        }
                    >
                        <Check
                            size={17}
                        />

                        {success}
                    </div>
                )}

                <div
                    className={
                        styles.actions
                    }
                >
                    <Link
                        to={backPath}
                        className={
                            styles.cancelButton
                        }
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        className={
                            styles.submitButton
                        }
                        disabled={
                            saving
                        }
                    >
                        {saving ? (
                            <>
                                <LoaderCircle
                                    size={17}
                                    className={
                                        styles.spinner
                                    }
                                />

                                Enviando...
                            </>
                        ) : (
                            <>
                                <Upload
                                    size={17}
                                />

                                Enviar arquivo
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}