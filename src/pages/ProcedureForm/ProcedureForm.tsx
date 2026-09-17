import { useEffect, useState } from "react";

import {
    ArrowLeft,
    Check,
    ChevronDown,
    LoaderCircle,
    X,
} from "lucide-react";

import {
    Link,
    Navigate,
    useNavigate,
    useParams,
} from "react-router";

import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

import {
    createProcedure,
    getProcedureForEdit,
    updateProcedure,
} from "@/services/procedureService";

import { getDepartmentsForProcedure } from "@/services/departmentService";

import { useAuth } from "@/hooks/useAuth";

import type { Department } from "@/types/Department";

import type {
    ProcedureInput,
    ProcedureStatus,
} from "@/types/Procedure";

import styles from "./ProcedureForm.module.css";


const EMPTY_FORM: ProcedureInput = {
    title: "",
    description: "",
    content: "",
    departmentIds: [],
    status: 0,
};


export function ProcedureForm() {
    const { procedureId } = useParams();
    const navigate = useNavigate();
    const { hasRole } = useAuth();

    const isEditing = Boolean(procedureId);

    const canManageProcedure =
        hasRole("Admin") ||
        hasRole("Editor");

    const [departments, setDepartments] = useState<Department[]>([]);
    const [form, setForm] = useState<ProcedureInput>(EMPTY_FORM);
    const [departmentSelectorOpen, setDepartmentSelectorOpen] = useState(false);
    const [loadedFor, setLoadedFor] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadKey = procedureId ?? "new";
    const loading = loadedFor !== loadKey;


    useEffect(() => {
        let ignore = false;

        async function loadData() {
            try {
                const departmentsData = await getDepartmentsForProcedure();

                if (ignore) {
                    return;
                }

                setDepartments(departmentsData);

                if (procedureId) {
                    const procedure = await getProcedureForEdit(procedureId);

                    if (ignore) {
                        return;
                    }

                    setForm({
                        title: procedure.title,
                        description: procedure.description,
                        content: procedure.content,
                        departmentIds: procedure.departments
                            .map((department) => department.id),
                        status: procedure.status,
                    });
                } else {
                    setForm({
                        ...EMPTY_FORM,
                        departmentIds: [],
                    });
                }

                setError("");
            } catch (error) {
                console.error("Erro ao carregar formulário:", error);

                if (ignore) {
                    return;
                }

                setError("Não foi possível carregar os dados do formulário.");
            } finally {
                if (!ignore) {
                    setLoadedFor(loadKey);
                }
            }
        }

        loadData();

        return () => {
            ignore = true;
        };
    }, [procedureId, loadKey]);


    function handleChange(
        field: "title" | "description" | "content",
        value: string
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }


    function handleStatusChange(value: string) {
        const status = Number(value) as ProcedureStatus;

        setForm((current) => ({
            ...current,
            status,
        }));
    }


    function handleDepartmentToggle(departmentId: string) {
        setForm((current) => {
            const alreadySelected = current.departmentIds.includes(departmentId);

            return {
                ...current,
                departmentIds: alreadySelected
                    ? current.departmentIds
                        .filter((id) => id !== departmentId)
                    : [
                        ...current.departmentIds,
                        departmentId,
                    ],
            };
        });

        setError("");
    }


    function handleRemoveDepartment(departmentId: string) {
        setForm((current) => ({
            ...current,
            departmentIds: current.departmentIds
                .filter((id) => id !== departmentId),
        }));
    }


    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (form.departmentIds.length === 0) {
            setError("Selecione pelo menos um departamento.");
            return;
        }

        setSaving(true);
        setError("");

        try {
            let procedure;

            if (procedureId) {
                procedure = await updateProcedure(procedureId, form);
            } else {
                procedure = await createProcedure(form);
            }

            if (form.status === 0) {
                navigate("/procedures/drafts");
                return;
            }

            navigate(`/procedures/${procedure.id}`);
        } catch (error) {
            console.error("Erro ao salvar procedimento:", error);
            setError("Não foi possível salvar o procedimento.");
        } finally {
            setSaving(false);
        }
    }


    if (!canManageProcedure) {
        return (
            <Navigate
                to={procedureId ? `/procedures/${procedureId}` : "/"}
                replace
            />
        );
    }


    if (loading) {
        return (
            <div className={styles.loading}>
                <LoaderCircle
                    size={24}
                    className={styles.loadingIcon}
                />
            </div>
        );
    }


    const selectedDepartments = departments
        .filter((department) =>
            form.departmentIds.includes(department.id)
        );


    return (
        <div className={styles.page}>
            <Link
                to={procedureId ? `/procedures/${procedureId}` : "/"}
                className={styles.back}
            >
                <ArrowLeft size={15} />
                Voltar
            </Link>


            <header className={styles.header}>
                <h1>
                    {isEditing
                        ? "Editar procedimento"
                        : "Novo procedimento"}
                </h1>

                <p>
                    {isEditing
                        ? "Atualize as informações e o conteúdo do procedimento."
                        : "Crie um novo procedimento para a base de conhecimento."}
                </p>
            </header>


            <form
                className={styles.form}
                onSubmit={handleSubmit}
            >
                <div className={styles.field}>
                    <label htmlFor="title">
                        Título
                    </label>

                    <input
                        id="title"
                        type="text"
                        value={form.title}
                        onChange={(event) =>
                            handleChange("title", event.target.value)
                        }
                        placeholder="Ex: Configuração de ONU"
                        required
                    />
                </div>


                <div className={styles.field}>
                    <label htmlFor="description">
                        Descrição
                    </label>

                    <textarea
                        id="description"
                        value={form.description}
                        onChange={(event) =>
                            handleChange("description", event.target.value)
                        }
                        placeholder="Breve descrição do procedimento"
                        rows={3}
                        required
                    />
                </div>


                <div className={styles.field}>
                    <label>
                        Departamentos
                    </label>

                    <div className={styles.departmentSelector}>
                        {selectedDepartments.length > 0 && (
                            <div className={styles.selectedDepartments}>
                                {selectedDepartments.map((department) => (
                                    <div
                                        key={department.id}
                                        className={styles.departmentChip}
                                    >
                                        <span>
                                            {department.name}
                                        </span>

                                        <button
                                            type="button"
                                            className={styles.removeDepartment}
                                            onClick={() =>
                                                handleRemoveDepartment(department.id)
                                            }
                                            aria-label={`Remover ${department.name}`}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}


                        <button
                            type="button"
                            className={`${styles.selectControl} ${
                                departmentSelectorOpen
                                    ? styles.selectControlOpen
                                    : ""
                            }`}
                            onClick={() =>
                                setDepartmentSelectorOpen((current) => !current)
                            }
                            aria-expanded={departmentSelectorOpen}
                        >
                            <span>
                                {form.departmentIds.length === 0
                                    ? "Selecione um ou mais departamentos"
                                    : `${form.departmentIds.length} departamento${form.departmentIds.length !== 1 ? "s" : ""} selecionado${form.departmentIds.length !== 1 ? "s" : ""}`}
                            </span>

                            <ChevronDown
                                size={16}
                                className={`${styles.selectChevron} ${
                                    departmentSelectorOpen
                                        ? styles.selectChevronOpen
                                        : ""
                                }`}
                            />
                        </button>


                        {departmentSelectorOpen && (
                            <div className={styles.departmentOptions}>
                                {departments.length > 0 ? (
                                    departments.map((department) => {
                                        const selected = form.departmentIds.includes(department.id);

                                        return (
                                            <button
                                                key={department.id}
                                                type="button"
                                                className={`${styles.departmentOption} ${
                                                    selected
                                                        ? styles.departmentOptionSelected
                                                        : ""
                                                }`}
                                                onClick={() =>
                                                    handleDepartmentToggle(department.id)
                                                }
                                            >
                                                <span
                                                    className={`${styles.checkbox} ${
                                                        selected
                                                            ? styles.checkboxSelected
                                                            : ""
                                                    }`}
                                                >
                                                    {selected && (
                                                        <Check size={13} />
                                                    )}
                                                </span>

                                                <span>
                                                    {department.name}
                                                </span>
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className={styles.noDepartments}>
                                        Nenhum departamento disponível.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>


                <div className={styles.field}>
                    <label htmlFor="status">
                        Status
                    </label>

                    <select
                        id="status"
                        value={form.status}
                        onChange={(event) =>
                            handleStatusChange(event.target.value)
                        }
                    >
                        <option value={0}>
                            Rascunho
                        </option>

                        <option value={1}>
                            Publicado
                        </option>
                    </select>
                </div>


                <div className={styles.field}>
                    <label>
                        Conteúdo
                    </label>

                    <div className={styles.editorWrapper}>
                        <SimpleEditor
                            value={form.content}
                            onChange={(content) =>
                                handleChange("content", content)
                            }
                        />
                    </div>
                </div>


                {error && (
                    <div
                        className={styles.error}
                        role="alert"
                    >
                        {error}
                    </div>
                )}


                <div className={styles.actions}>
                    <Link
                        to={procedureId ? `/procedures/${procedureId}` : "/"}
                        className={styles.cancelButton}
                    >
                        Cancelar
                    </Link>

                    <button
                        type="submit"
                        className={styles.saveButton}
                        disabled={saving}
                    >
                        {saving
                            ? "Salvando..."
                            : form.status === 0
                                ? "Salvar rascunho"
                                : isEditing
                                    ? "Publicar alterações"
                                    : "Publicar procedimento"}
                    </button>
                </div>
            </form>
        </div>
    );
}