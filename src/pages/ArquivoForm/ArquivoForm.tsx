import {
    useEffect,
    useState,
} from "react";

import {
    FileText,
    LoaderCircle,
    Upload,
} from "lucide-react";

import {
    Navigate,
} from "react-router";

import {
    getDepartmentsForProcedure,
} from "@/services/departmentService";

import {
    uploadArquivo,
} from "@/services/arquivoService";

import { useAuth } from "@/hooks/useAuth";

import type { Department } from "@/types/Department";

import styles from "./ArquivoForm.module.css";


export function ArquivoForm() {
    const { hasRole } = useAuth();

    const [file, setFile] =
        useState<File | null>(null);

    const [
        departments,
        setDepartments,
    ] = useState<Department[]>([]);

    const [
        selectedDepartmentIds,
        setSelectedDepartmentIds,
    ] = useState<string[]>([]);

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

                if (!ignore) {
                    setDepartments(data);
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
    }, []);


    function handleDepartmentToggle(
        departmentId: string
    ) {
        setSelectedDepartmentIds(
            (current) => {
                if (
                    current.includes(
                        departmentId
                    )
                ) {
                    return current.filter(
                        (id) =>
                            id !== departmentId
                    );
                }

                return [
                    ...current,
                    departmentId,
                ];
            }
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
            selectedDepartmentIds.length === 0
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
            const id =
                await uploadArquivo(
                    file,
                    selectedDepartmentIds
                );

            setSuccess(
                `Arquivo enviado com sucesso. ID: ${id}`
            );

            setFile(null);
            setSelectedDepartmentIds([]);
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
            <div className={styles.loading}>
                <LoaderCircle
                    size={20}
                    className={styles.spinner}
                />

                Carregando...
            </div>
        );
    }


    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <h1>
                        Adicionar arquivo
                    </h1>

                    <p>
                        Envie um arquivo e selecione os departamentos que poderão acessá-lo.
                    </p>
                </div>
            </header>


            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <section className={styles.section}>
                    <h2>
                        Arquivo
                    </h2>

                    <label
                        className={styles.fileInput}
                    >
                        <Upload size={24} />

                        <span>
                            {file
                                ? file.name
                                : "Selecionar arquivo"}
                        </span>

                        <input
                            type="file"
                            onChange={(event) => {
                                const selectedFile =
                                    event.target.files?.[0]
                                    ?? null;

                                setFile(
                                    selectedFile
                                );

                                setError("");
                                setSuccess("");
                            }}
                        />
                    </label>


                    {file && (
                        <div
                            className={
                                styles.fileInfo
                            }
                        >
                            <FileText size={18} />

                            <div>
                                <strong>
                                    {file.name}
                                </strong>

                                <span>
                                    {(
                                        file.size /
                                        1024
                                    ).toFixed(2)} KB
                                </span>
                            </div>
                        </div>
                    )}
                </section>


                <section className={styles.section}>
                    <h2>
                        Departamentos
                    </h2>

                    <div
                        className={
                            styles.departments
                        }
                    >
                        {departments.map(
                            (department) => (
                                <label
                                    key={
                                        department.id
                                    }
                                    className={
                                        styles.department
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedDepartmentIds.includes(
                                                department.id
                                            )
                                        }
                                        onChange={() =>
                                            handleDepartmentToggle(
                                                department.id
                                            )
                                        }
                                    />

                                    <span>
                                        {
                                            department.name
                                        }
                                    </span>
                                </label>
                            )
                        )}
                    </div>
                </section>


                {error && (
                    <p className={styles.error}>
                        {error}
                    </p>
                )}


                {success && (
                    <p className={styles.success}>
                        {success}
                    </p>
                )}


                <div className={styles.actions}>
                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? (
                            <>
                                <LoaderCircle
                                    size={18}
                                    className={
                                        styles.spinner
                                    }
                                />

                                Enviando...
                            </>
                        ) : (
                            <>
                                <Upload size={18} />

                                Enviar arquivo
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}