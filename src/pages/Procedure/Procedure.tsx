import { useEffect, useState } from "react";
import { ChevronRight, Pencil } from "lucide-react";
import { Link, useParams } from "react-router";

import { EditorContent, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";

// --- Custom Tiptap Node ---
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";

// --- Tiptap Styles ---
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

import "@/components/tiptap-templates/simple/simple-editor.scss";

// --- Markdown fallback ---
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// --- Services / Types ---
import { getProcedureById } from "@/services/procedureService";
import type { Procedure as ProcedureType } from "@/types/Procedure";

// --- Styles ---
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

export function Procedure() {
    const { procedureId } = useParams();

    const [procedure, setProcedure] =
        useState<ProcedureType | null>(null);

    const [loading, setLoading] =
        useState(true);

    const tiptapContent = procedure
        ? parseTiptapContent(procedure.content)
        : null;

    const editor = useEditor({
        editable: false,

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
        async function loadProcedure() {
            if (!procedureId) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const data =
                    await getProcedureById(procedureId);

                setProcedure(data ?? null);
            } finally {
                setLoading(false);
            }
        }

        loadProcedure();
    }, [procedureId]);

    useEffect(() => {
        if (!editor || !procedure) {
            return;
        }

        const content =
            parseTiptapContent(
                procedure.content
            );

        if (!content) {
            return;
        }

        editor.commands.setContent(
            content,
            {
                emitUpdate: false,
            }
        );
    }, [editor, procedure]);

    if (loading) {
        return <p>Carregando...</p>;
    }

    if (!procedure) {
        return (
            <p>
                Procedimento não encontrado.
            </p>
        );
    }

    const canEdit = true;

    const isTiptapContent =
        parseTiptapContent(
            procedure.content
        ) !== null;

    return (
        <article className={styles.page}>

            {/*
                Mantemos apenas as variáveis
                utilizadas pelas cores do Highlight.

                Blockquote, code block, headings etc.
                ficam no Procedure.module.css.
            */}
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

                <ChevronRight size={14} />

                <Link
                    to={`/departments/${procedure.departmentId}`}
                >
                    {procedure.departmentName}
                </Link>
            </div>

            <header className={styles.header}>
                <div>
                    <h1>
                        {procedure.title}
                    </h1>

                    <div className={styles.metadata}>
                        <span>
                            {procedure.writerName}
                        </span>

                        <span>·</span>

                        <span>
                            {procedure.lastUpdate}
                        </span>
                    </div>
                </div>

                {canEdit && (
                    <Link
                        to={`/procedures/${procedure.id}/edit`}
                        className={styles.editButton}
                    >
                        <Pencil size={14} />

                        Editar
                    </Link>
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
                    <ReactMarkdown
                        remarkPlugins={[
                            remarkGfm,
                        ]}
                    >
                        {procedure.content}
                    </ReactMarkdown>
                )}
            </div>
        </article>
    );
}