import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

import {
    createProcedure,
    getProcedureById,
    updateProcedure,
} from "@/services/procedureService";

import { getDepartments } from "@/services/departmentService";

import type { Department } from "@/types/Department";
import type { ProcedureInput } from "@/types/Procedure";

import styles from "./ProcedureForm.module.css";

export function ProcedureForm() {
    const { procedureId } = useParams();

    const navigate = useNavigate();

    const isEditing = Boolean(procedureId);

    const [departments, setDepartments] = useState<Department[]>([]);

    const [form, setForm] = useState<ProcedureInput>({
        title: "",
        description: "",
        content: "",
        departmentId: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function loadData() {
            setLoading(true);

            try {
                const departmentsData = await getDepartments();

                setDepartments(departmentsData);

                if (procedureId) {
                    const procedure = await getProcedureById(procedureId);

                    if (!procedure) {
                        return;
                    }

                    setForm({
                        title: procedure.title,
                        description: procedure.description,
                        content: procedure.content,
                        departmentId: procedure.departmentId,
                    });
                }
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [procedureId]);

    function handleChange(
        field: keyof ProcedureInput,
        value: string
    ) {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    }

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setSaving(true);

        try {
            if (procedureId) {
                const procedure = await updateProcedure(
                    procedureId,
                    form
                );

                navigate(`/procedures/${procedure.id}`);

                return;
            }

            const procedure = await createProcedure(form);

            navigate(`/procedures/${procedure.id}`);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <p>Carregando...</p>;
    }

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
                            handleChange(
                                "title",
                                event.target.value
                            )
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
                            handleChange(
                                "description",
                                event.target.value
                            )
                        }
                        placeholder="Breve descrição do procedimento"
                        rows={3}
                        required
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="department">
                        Departamento
                    </label>

                    <select
                        id="department"
                        value={form.departmentId}
                        onChange={(event) =>
                            handleChange(
                                "departmentId",
                                event.target.value
                            )
                        }
                        required
                    >
                        <option value="">
                            Selecione um departamento
                        </option>

                        {departments.map((department) => (
                            <option
                                key={department.id}
                                value={department.id}
                            >
                                {department.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={styles.field}>
                    <label>
                        Conteúdo
                    </label>

                    <div className={styles.editorWrapper}>
                        <SimpleEditor
                            value={form.content}
                            onChange={(markdown) =>
                                handleChange("content", markdown)
                            }
                        />
                    </div>
                </div>

                <div className={styles.actions}>
                    <Link
                        to={
                            procedureId
                                ? `/procedures/${procedureId}`
                                : "/"
                        }
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
                            : isEditing
                                ? "Salvar alterações"
                                : "Criar procedimento"}
                    </button>
                </div>
            </form>
        </div>
    );
}