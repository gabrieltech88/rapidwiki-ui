import { useEffect, useState } from "react";

import {
    ChevronRight,
    LoaderCircle,
    Pencil,
    Trash2,
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router";

import {
    EditorContent,
    useEditor,
} from "@tiptap/react";

import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import {
    TaskItem,
    TaskList,
} from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";

import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";

import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";
import "@/components/tiptap-templates/simple/simple-editor.scss";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
    deleteProcedure,
    getProcedureById,
} from "@/services/procedureService";

import { useAuth } from "@/hooks/useAuth";

import type { ProcedureDetails } from "@/types/Procedure";

import styles from "./Procedure.module.css";


function parseTiptapContent(content: string) {
    try {
        const parsed = JSON.parse(content);

        if (
            parsed &&
            typeof parsed === "object" &&
            parsed.type === "doc"
        ) {
            return parsed;
        }

        return null;
    } catch {
        return null;
    }
}


interface ProcedureLoadState {
    procedureId?: string;
    procedure: ProcedureDetails | null;
    error: string;
}


export function Procedure() {
    const { procedureId } = useParams();
    const navigate = useNavigate();
    const { hasRole } = useAuth();

    const [loadState, setLoadState] = useState<ProcedureLoadState>({
        procedureId: undefined,
        procedure: null,
        error: "",
    });

    const [deleting, setDeleting] = useState(false);

    const isCurrentProcedure = loadState.procedureId === procedureId;
    const loading = Boolean(procedureId) && !isCurrentProcedure;
    const procedure = isCurrentProcedure ? loadState.procedure : null;
    const error = isCurrentProcedure ? loadState.error : "";

    const canEdit =
        hasRole("Admin") ||
        hasRole("Editor");

    const tiptapContent = procedure
        ? parseTiptapContent(procedure.content)
        : null;

    const editor = useEditor({
        editable: false,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: "simple-editor",
                "aria-label": "Conteúdo do procedimento",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: true,
                    enableClickSelection: true,
                },
            }),
            TextStyleKit,
            HorizontalRule,
            TextAlign.configure({
                types: [
                    "heading",
                    "paragraph",
                ],
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Highlight.configure({
                multicolor: true,
            }),
            Image,
            Typography,
            Superscript,
            Subscript,
        ],
        content: tiptapContent ?? {
            type: "doc",
            content: [],
        },
    });


    useEffect(() => {
        let ignore = false;

        async function loadProcedure() {
            if (!procedureId) {
                return;
            }

            try {
                const data = await getProcedureById(procedureId);

                if (ignore) {
                    return;
                }

                setLoadState({
                    procedureId,
                    procedure: data,
                    error: "",
                });
            } catch (error) {
                console.error("Erro ao carregar procedimento:", error);

                if (ignore) {
                    return;
                }

                setLoadState({
                    procedureId,
                    procedure: null,
                    error: "Não foi possível carregar este procedimento.",
                });
            }
        }

        loadProcedure();

        return () => {
            ignore = true;
        };
    }, [procedureId]);


    useEffect(() => {
        if (!editor || !procedure) {
            return;
        }

        const content = parseTiptapContent(procedure.content);

        if (!content) {
            return;
        }

        editor.commands.setContent(
            content,
            {
                emitUpdate: false,
            }
        );
    }, [
        editor,
        procedure,
    ]);


    async function handleDelete() {
        if (!procedure) {
            return;
        }

        const confirmed = window.confirm(
            `Deseja excluir o procedimento "${procedure.title}"? Essa ação também excluirá qualquer rascunho vinculado e não poderá ser desfeita.`
        );

        if (!confirmed) {
            return;
        }

        setDeleting(true);

        try {
            await deleteProcedure(procedure.id);
            navigate("/");
        } catch (error) {
            console.error("Erro ao excluir procedimento:", error);
            window.alert("Não foi possível excluir o procedimento.");
        } finally {
            setDeleting(false);
        }
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


    if (
        !procedureId ||
        error ||
        !procedure
    ) {
        return (
            <div className={styles.notFound}>
                <h2>
                    Procedimento não encontrado
                </h2>

                <p>
                    {error ||
                        "O procedimento solicitado não existe ou você não possui acesso a ele."}
                </p>

                <Link to="/">
                    Voltar para o início
                </Link>
            </div>
        );
    }


    const isTiptapContent =
        parseTiptapContent(procedure.content) !== null;

    const primaryDepartment =
        procedure.departments[0];


    return (
        <article className={styles.page}>
            <style>
                {`
                    :root {
                        --tt-color-highlight-yellow: #FEF08A;
                        --tt-color-highlight-green: #BBF7D0;
                        --tt-color-highlight-blue: #BFDBFE;
                        --tt-color-highlight-red: #FECACA;
                        --tt-color-highlight-purple: #E9D5FF;
                        --tt-color-highlight-orange: #FED7AA;
                    }
                `}
            </style>

            <div className={styles.breadcrumb}>
                <Link to="/">
                    Início
                </Link>

                {primaryDepartment && (
                    <>
                        <ChevronRight size={14} />

                        <Link to={`/departments/${primaryDepartment.id}/procedures`}>
                            {primaryDepartment.name}
                        </Link>
                    </>
                )}

                <ChevronRight size={14} />

                <span>
                    {procedure.title}
                </span>
            </div>


            <header className={styles.header}>
                <div className={styles.headerContent}>
                    <h1>
                        {procedure.title}
                    </h1>

                    {procedure.description && (
                        <p className={styles.description}>
                            {procedure.description}
                        </p>
                    )}

                    <div className={styles.metadata}>
                        <span>
                            {procedure.writerName}
                        </span>

                        <span>
                            ·
                        </span>

                        <span>
                            Criado em {procedure.createdAt}
                        </span>

                        <span>
                            ·
                        </span>

                        <span>
                            Atualizado em {procedure.lastUpdate}
                        </span>
                    </div>

                    {procedure.departments.length > 0 && (
                        <div className={styles.departments}>
                            {procedure.departments.map((department) => (
                                <Link
                                    key={department.id}
                                    to={`/departments/${department.id}/procedures`}
                                    className={styles.departmentTag}
                                >
                                    {department.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {canEdit && (
                    <div className={styles.actions}>
                        <Link
                            to={`/procedures/${procedure.id}/edit`}
                            className={styles.editButton}
                        >
                            <Pencil size={14} />
                            Editar
                        </Link>

                        <button
                            type="button"
                            className={styles.deleteButton}
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            <Trash2 size={14} />
                            {deleting ? "Excluindo..." : "Excluir"}
                        </button>
                    </div>
                )}
            </header>


            <div className={styles.divider} />


            <div className={styles.markdown}>
                {isTiptapContent ? (
                    <div className="procedure-tiptap-viewer">
                        <EditorContent
                            editor={editor}
                            role="presentation"
                            className="simple-editor-content"
                        />
                    </div>
                ) : (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {procedure.content}
                    </ReactMarkdown>
                )}
            </div>
        </article>
    );
}
