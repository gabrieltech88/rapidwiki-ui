"use client"

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import type {
  ChangeEvent,
  CSSProperties,
  RefObject,
} from "react"

import {
  EditorContent,
  EditorContext,
  useEditor,
} from "@tiptap/react"

import type {
  Editor,
  JSONContent,
} from "@tiptap/core"

import { Markdown } from "@tiptap/markdown"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"

import {
  TaskItem,
  TaskList,
} from "@tiptap/extension-list"

import { TableKit } from "@tiptap/extension-table"

import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { TextStyleKit } from "@tiptap/extension-text-style"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { FindAndReplace } from "@tiptap/extension-find-and-replace"
import { Selection } from "@tiptap/extensions"

// --- Lucide ---
import {
  Columns3,
  Pilcrow,
  Rows3,
  Table2,
  Trash2,
} from "lucide-react"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import { Spacer } from "@/components/tiptap-ui-primitive/spacer"

import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/tiptap-ui-primitive/popover"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"

import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"

// --- Tiptap Node Styles ---
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"

import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"

import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"

import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"

import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"

import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"

import { MarkButton } from "@/components/tiptap-ui/mark-button"

import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"

import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

import {
  SearchAndReplace,
  SearchAndReplaceButton,
} from "@/components/tiptap-ui/search-and-replace"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"

import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"

import { useWindowSize } from "@/hooks/use-window-size"

import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Lib ---
import {
  handleImageUpload,
  MAX_FILE_SIZE,
} from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

const SEARCH_AND_REPLACE_SCROLL_OPTIONS: ScrollIntoViewOptions = {
  block: "center",
}

/* =========================================================
   CONTEÚDO
   ========================================================= */

function parseTiptapJson(
  value: string
): JSONContent | null {
  if (!value) {
    return null
  }

  try {
    const parsed = JSON.parse(value)

    if (
      parsed &&
      typeof parsed === "object" &&
      parsed.type === "doc"
    ) {
      return parsed as JSONContent
    }

    return null
  } catch {
    return null
  }
}

function getInitialContent(
  value: string
) {
  const json =
    parseTiptapJson(value)

  if (json) {
    return {
      content: json,
      isMarkdown: false,
    }
  }

  return {
    content: value || "",
    isMarkdown: true,
  }
}

/* =========================================================
   CORES DO TEXTO
   ========================================================= */

const TEXT_COLORS = [
  {
    name: "Padrão",
    color: null,
  },
  {
    name: "Cinza",
    color: "#9CA3AF",
  },
  {
    name: "Vermelho",
    color: "#EF4444",
  },
  {
    name: "Laranja",
    color: "#F97316",
  },
  {
    name: "Amarelo",
    color: "#EAB308",
  },
  {
    name: "Verde",
    color: "#22C55E",
  },
  {
    name: "Azul",
    color: "#3B82F6",
  },
  {
    name: "Roxo",
    color: "#A855F7",
  },
]

/* =========================================================
   SELETOR DE COR DO TEXTO
   ========================================================= */

const TextColorPicker = ({
  editor,
}: {
  editor: Editor | null
}) => {
  const [
    open,
    setOpen,
  ] = useState(false)

  const savedSelection =
    useRef<{
      from: number
      to: number
    } | null>(null)

  const saveSelection = () => {
    if (!editor) {
      return
    }

    const {
      from,
      to,
    } = editor.state.selection

    savedSelection.current = {
      from,
      to,
    }
  }

  const applyColor = (
    color: string | null
  ) => {
    if (!editor) {
      return
    }

    const selection =
      savedSelection.current ??
      editor.state.selection

    const chain = editor
      .chain()
      .focus()
      .setTextSelection({
        from: selection.from,
        to: selection.to,
      })

    if (color) {
      chain
        .setColor(color)
        .run()
    } else {
      chain
        .unsetColor()
        .run()
    }

    savedSelection.current = null

    setOpen(false)
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          title="Cor do texto"
          onPointerDownCapture={
            saveSelection
          }
        >
          <span
            style={{
              fontWeight: 700,
              fontSize: "16px",
              lineHeight: 1,
              paddingBottom: "2px",
              borderBottom:
                "3px solid currentColor",
            }}
          >
            A
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4, 34px)",
            gap: "8px",
            padding: "4px",
          }}
        >
          {TEXT_COLORS.map(
            (item) => (
              <button
                key={item.name}
                type="button"
                title={item.name}
                onPointerDown={(
                  event
                ) => {
                  event.preventDefault()

                  applyColor(
                    item.color
                  )
                }}
                style={{
                  width: "34px",
                  height: "34px",
                  display: "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  padding: 0,
                  borderRadius:
                    "6px",
                  border:
                    "1px solid rgba(128, 128, 128, 0.3)",
                  background:
                    "transparent",
                  cursor:
                    "pointer",
                }}
              >
                {item.color ? (
                  <span
                    style={{
                      width:
                        "20px",
                      height:
                        "20px",
                      borderRadius:
                        "50%",
                      backgroundColor:
                        item.color,
                    }}
                  />
                ) : (
                  <span
                    style={{
                      fontSize:
                        "16px",
                      fontWeight:
                        700,
                    }}
                  >
                    A
                  </span>
                )}
              </button>
            )
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* =========================================================
   TAMANHO DA FONTE
   ========================================================= */

const FontSizePicker = ({
  editor,
}: {
  editor: Editor | null
}) => {
  const handleChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    if (!editor) {
      return
    }

    const size =
      event.target.value

    if (
      size === "default"
    ) {
      editor
        .chain()
        .focus()
        .unsetFontSize()
        .run()
    } else if (size) {
      editor
        .chain()
        .focus()
        .setFontSize(size)
        .run()
    }

    event.target.value = ""
  }

  return (
    <select
      defaultValue=""
      title="Tamanho da fonte"
      aria-label="Tamanho da fonte"
      onChange={
        handleChange
      }
      style={{
        height: "27px",
        minWidth: "72px",
        padding:
          "0 4px",
        borderRadius:
          "5px",
        border:
          "1px solid rgba(255, 255, 255, 0.12)",
        backgroundColor:
          "#161616",
        color:
          "#f5f5f5",
        colorScheme:
          "dark",
        cursor:
          "pointer",
        fontSize:
          "11px",
      }}
    >
      <option
        value=""
        disabled
      >
        Tamanho
      </option>

      <option value="default">
        Padrão
      </option>

      <option value="12px">
        12
      </option>

      <option value="14px">
        14
      </option>

      <option value="16px">
        16
      </option>

      <option value="18px">
        18
      </option>

      <option value="20px">
        20
      </option>

      <option value="24px">
        24
      </option>

      <option value="32px">
        32
      </option>
    </select>
  )
}

/* =========================================================
   ESTILOS DO MENU DE TABELA
   ========================================================= */

const tableMenuItemStyle: CSSProperties = {
  width: "100%",
  minHeight: "34px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "7px 10px",
  border: "none",
  borderRadius: "5px",
  background:
    "transparent",
  color:
    "var(--color-text-primary)",
  textAlign:
    "left",
  cursor:
    "pointer",
  fontSize:
    "13px",
  fontFamily:
    "inherit",
}

const tableMenuTitleStyle: CSSProperties = {
  padding:
    "5px 10px",
  color:
    "var(--color-text-muted)",
  fontSize:
    "10px",
  fontWeight:
    600,
  textTransform:
    "uppercase",
  letterSpacing:
    "0.06em",
}

const tableSeparatorStyle: CSSProperties = {
  width: "100%",
  height: "1px",
  margin:
    "4px 0",
  background:
    "var(--color-border-primary)",
}

/* =========================================================
   MENU DE TABELA
   ========================================================= */

const TableMenu = ({
  editor,
}: {
  editor: Editor | null
}) => {
  const [
    open,
    setOpen,
  ] = useState(false)

  if (!editor) {
    return (
      <Button
        type="button"
        variant="ghost"
        title="Tabela"
        disabled
      >
        <Table2
          size={16}
        />
      </Button>
    )
  }

  const runCommand = (
    command: () => void
  ) => {
    command()

    setOpen(false)
  }

  const isInsideTable =
    editor.isActive(
      "table"
    )

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger
        asChild
      >
        <Button
          type="button"
          variant="ghost"
          title="Tabela"
          aria-label="Tabela"
        >
          <Table2
            size={16}
          />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom"
        align="start"
      >
        <div
          style={{
            width:
              "230px",
            display:
              "flex",
            flexDirection:
              "column",
            gap:
              "2px",
            padding:
              "4px",
          }}
        >
          <button
            type="button"
            style={
              tableMenuItemStyle
            }
            onClick={() =>
              runCommand(
                () => {
                  editor
                    .chain()
                    .focus()
                    .insertTable({
                      rows: 3,
                      cols: 3,
                      withHeaderRow:
                        true,
                    })
                    .run()
                }
              )
            }
          >
            <Table2
              size={15}
            />

            Inserir tabela 3 × 3
          </button>

          <div
            style={
              tableSeparatorStyle
            }
          />

          <div
            style={
              tableMenuTitleStyle
            }
          >
            Coluna
          </div>

          <button
            type="button"
            disabled={
              !isInsideTable
            }
            style={{
              ...tableMenuItemStyle,
              opacity:
                isInsideTable
                  ? 1
                  : 0.4,
              cursor:
                isInsideTable
                  ? "pointer"
                  : "not-allowed",
            }}
            onClick={() =>
              runCommand(
                () => {
                  editor
                    .chain()
                    .focus()
                    .addColumnBefore()
                    .run()
                }
              )
            }
          >
            <Columns3
              size={15}
            />

            Adicionar coluna antes
          </button>

          <button
            type="button"
            disabled={
              !isInsideTable
            }
            style={{
              ...tableMenuItemStyle,
              opacity:
                isInsideTable
                  ? 1
                  : 0.4,
              cursor:
                isInsideTable
                  ? "pointer"
                  : "not-allowed",
            }}
            onClick={() =>
              runCommand(
                () => {
                  editor
                    .chain()
                    .focus()
                    .addColumnAfter()
                    .run()
                }
              )
            }
          >
            <Columns3
              size={15}
            />

            Adicionar coluna depois
          </button>

          <button
            type="button"
            disabled={
              !isInsideTable
            }
            style={{
              ...tableMenuItemStyle,
              opacity:
                isInsideTable
                  ? 1
                  : 0.4,
              cursor:
                isInsideTable
                  ? "pointer"
                  : "not-allowed",
            }}
            onClick={() =>
              runCommand(
                () => {
                  editor
                    .chain()
                    .focus()
                    .deleteColumn()
                    .run()
                }
              )
            }
          >
            <Trash2
              size={15}
            />

            Remover coluna
          </button>

          <div
            style={
              tableSeparatorStyle
            }
          />

          <div
            style={
              tableMenuTitleStyle
            }
          >
            Linha
          </div>

          <button
            type="button"
            disabled={
              !isInsideTable
            }
            style={{
              ...tableMenuItemStyle,
              opacity:
                isInsideTable
                  ? 1
                  : 0.4,
              cursor:
                isInsideTable
                  ? "pointer"
                  : "not-allowed",
            }}
            onClick={() =>
              runCommand(
                () => {
                  editor
                    .chain()
                    .focus()
                    .addRowBefore()
                    .run()
                }
              )
            }
          >
            <Rows3
              size={15}
            />

            Adicionar linha acima
          </button>

          <button
            type="button"
            disabled={
              !isInsideTable
            }
            style={{
              ...tableMenuItemStyle,
              opacity:
                isInsideTable
                  ? 1
                  : 0.4,
              cursor:
                isInsideTable
                  ? "pointer"
                  : "not-allowed",
            }}
            onClick={() =>
              runCommand(
                () => {
                  editor
                    .chain()
                    .focus()
                    .addRowAfter()
                    .run()
                }
              )
            }
          >
            <Rows3
              size={15}
            />

            Adicionar linha abaixo
          </button>

          <button
            type="button"
            disabled={
              !isInsideTable
            }
            style={{
              ...tableMenuItemStyle,
              opacity:
                isInsideTable
                  ? 1
                  : 0.4,
              cursor:
                isInsideTable
                  ? "pointer"
                  : "not-allowed",
            }}
            onClick={() =>
              runCommand(
                () => {
                  editor
                    .chain()
                    .focus()
                    .deleteRow()
                    .run()
                }
              )
            }
          >
            <Trash2
              size={15}
            />

            Remover linha
          </button>

          <div
            style={
              tableSeparatorStyle
            }
          />

          <div
            style={
              tableMenuTitleStyle
            }
          >
            Célula
          </div>

          <button
            type="button"
            disabled={
              !isInsideTable
            }
            style={{
              ...tableMenuItemStyle,
              opacity:
                isInsideTable
                  ? 1
                  : 0.4,
              cursor:
                isInsideTable
                  ? "pointer"
                  : "not-allowed",
            }}
            onClick={() =>
              runCommand(
                () => {
                  editor
                    .chain()
                    .focus()
                    .mergeCells()
                    .run()
                }
              )
            }
          >
            Mesclar células
          </button>

          <button
            type="button"
            disabled={
              !isInsideTable
            }
            style={{
              ...tableMenuItemStyle,
              opacity:
                isInsideTable
                  ? 1
                  : 0.4,
              cursor:
                isInsideTable
                  ? "pointer"
                  : "not-allowed",
            }}
            onClick={() =>
              runCommand(
                () => {
                  editor
                    .chain()
                    .focus()
                    .splitCell()
                    .run()
                }
              )
            }
          >
            Separar célula
          </button>

          <button
            type="button"
            disabled={
              !isInsideTable
            }
            style={{
              ...tableMenuItemStyle,
              opacity:
                isInsideTable
                  ? 1
                  : 0.4,
              cursor:
                isInsideTable
                  ? "pointer"
                  : "not-allowed",
            }}
            onClick={() =>
              runCommand(
                () => {
                  editor
                    .chain()
                    .focus()
                    .toggleHeaderCell()
                    .run()
                }
              )
            }
          >
            Alternar cabeçalho
          </button>

          <div
            style={
              tableSeparatorStyle
            }
          />

          <button
            type="button"
            disabled={
              !isInsideTable
            }
            style={{
              ...tableMenuItemStyle,
              color:
                "#ef4444",
              opacity:
                isInsideTable
                  ? 1
                  : 0.4,
              cursor:
                isInsideTable
                  ? "pointer"
                  : "not-allowed",
            }}
            onClick={() =>
              runCommand(
                () => {
                  editor
                    .chain()
                    .focus()
                    .deleteTable()
                    .run()
                }
              )
            }
          >
            <Trash2
              size={15}
            />

            Excluir tabela
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/* =========================================================
   TOOLBAR PRINCIPAL
   ========================================================= */

const MainToolbarContent = ({
  editor,
  onHighlighterClick,
  onSearchAndReplaceClick,
  isSearchAndReplaceOpen,
  searchAndReplaceButtonRef,
  isMobile,
}: {
  editor: Editor | null

  onHighlighterClick:
    () => void

  onSearchAndReplaceClick:
    () => void

  isSearchAndReplaceOpen:
    boolean

  searchAndReplaceButtonRef:
    RefObject<HTMLButtonElement | null>

  isMobile:
    boolean
}) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton
          action="undo"
        />

        <UndoRedoButton
          action="redo"
        />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <Button
          type="button"
          variant="ghost"
          title="Texto normal"
          aria-label="Texto normal"
          data-active-state={
            editor?.isActive(
              "paragraph"
            )
              ? "on"
              : "off"
          }
          disabled={!editor}
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .setParagraph()
              .run()
          }
        >
          <Pilcrow
            size={16}
          />
        </Button>

        <HeadingDropdownMenu
          modal={false}
          levels={[
            1,
            2,
            3,
            4,
          ]}
        />

        <ListDropdownMenu
          modal={false}
          types={[
            "bulletList",
            "orderedList",
            "taskList",
          ]}
        />

        <BlockquoteButton />

        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton
          type="bold"
        />

        <MarkButton
          type="italic"
        />

        <MarkButton
          type="strike"
        />

        <MarkButton
          type="code"
        />

        <MarkButton
          type="underline"
        />

        <TextColorPicker
          editor={editor}
        />

        {!isMobile ? (
          <ColorHighlightPopover
            editor={editor}
          />
        ) : (
          <ColorHighlightPopoverButton
            onClick={
              onHighlighterClick
            }
          />
        )}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <FontSizePicker
          editor={editor}
        />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton
          type="superscript"
        />

        <MarkButton
          type="subscript"
        />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton
          align="left"
        />

        <TextAlignButton
          align="center"
        />

        <TextAlignButton
          align="right"
        />

        <TextAlignButton
          align="justify"
        />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TableMenu
          editor={editor}
        />

        <ImageUploadButton
          text="Add"
        />
      </ToolbarGroup>

      <Spacer />

      {isMobile && (
        <ToolbarSeparator />
      )}

      <ToolbarGroup>
        <SearchAndReplaceButton
          ref={
            searchAndReplaceButtonRef
          }
          aria-expanded={
            isSearchAndReplaceOpen
          }
          data-active-state={
            isSearchAndReplaceOpen
              ? "on"
              : "off"
          }
          onClick={
            onSearchAndReplaceClick
          }
        />
      </ToolbarGroup>
    </>
  )
}

/* =========================================================
   TOOLBAR MOBILE
   ========================================================= */

const MobileToolbarContent = ({
  editor,
  onBack,
}: {
  editor: Editor | null

  onBack:
    () => void
}) => {
  return (
    <>
      <ToolbarGroup>
        <Button
          variant="ghost"
          onClick={
            onBack
          }
        >
          <ArrowLeftIcon className="tiptap-button-icon" />

          <HighlighterIcon className="tiptap-button-icon" />
        </Button>
      </ToolbarGroup>

      <ToolbarSeparator />

      <ColorHighlightPopoverContent
        editor={editor}
      />
    </>
  )
}

/* =========================================================
   EDITOR
   ========================================================= */

interface SimpleEditorProps {
  value: string

  onChange:
    (content: string) => void
}

type MobileView =
  | "main"
  | "highlighter"

export function SimpleEditor({
  value,
  onChange,
}: SimpleEditorProps) {
  const isMobile =
    useIsBreakpoint()

  const {
    height,
  } = useWindowSize()

  const [
    mobileView,
    setMobileView,
  ] = useState<MobileView>(
    "main"
  )

  const [
    isSearchAndReplaceOpen,
    setIsSearchAndReplaceOpen,
  ] = useState(false)

  const [
    toolbarHeight,
    setToolbarHeight,
  ] = useState(0)

  const toolbarRef =
    useRef<HTMLDivElement>(
      null
    )

  const searchAndReplaceButtonRef =
    useRef<HTMLButtonElement>(
      null
    )

  const initialContent =
    getInitialContent(
      value
    )

  const editor =
    useEditor({
      immediatelyRender:
        false,

      editorProps: {
        attributes: {
          autocomplete:
            "off",

          autocorrect:
            "off",

          autocapitalize:
            "off",

          "aria-label":
            "Main content area, start typing to enter text.",

          class:
            "simple-editor",
        },
      },

      extensions: [
        StarterKit.configure({
          horizontalRule:
            false,

          link: {
            openOnClick:
              false,

            enableClickSelection:
              true,
          },
        }),

        TextStyleKit,

        TableKit.configure({
          table: {
            resizable:
              true,
          },
        }),

        HorizontalRule,

        TextAlign.configure({
          types: [
            "heading",
            "paragraph",
          ],
        }),

        TaskList,

        TaskItem.configure({
          nested:
            true,
        }),

        Highlight.configure({
          multicolor:
            true,
        }),

        Typography,

        Superscript,

        Subscript,

        Selection,

        FindAndReplace.configure({
          searchDebounceMs:
            500,

          injectCSS:
            false,
        }),

        ImageUploadNode.configure({
          accept:
            "image/*",

          maxSize:
            MAX_FILE_SIZE,

          limit:
            3,

          upload:
            handleImageUpload,

          onError:
            (error) =>
              console.error(
                "Upload failed:",
                error
              ),
        }),

        Image.configure({
          inline:
            false,

          allowBase64:
            false,
        }),

        Markdown,
      ],

      content:
        initialContent.content,

      ...(initialContent.isMarkdown
        ? {
            contentType:
              "markdown" as const,
          }
        : {}),

      onUpdate: ({
        editor,
      }) => {
        const json =
          editor.getJSON()

        onChange(
          JSON.stringify(
            json
          )
        )
      },
    })

  /* =======================================================
     ALTURA DA TOOLBAR
     ======================================================= */

  useEffect(() => {
    const toolbar =
      toolbarRef.current

    if (!toolbar) {
      return
    }

    const resizeObserver =
      new ResizeObserver(
        (entries) => {
          const entry =
            entries[0]

          if (!entry) {
            return
          }

          setToolbarHeight(
            entry
              .contentRect
              .height
          )
        }
      )

    resizeObserver.observe(
      toolbar
    )

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  /* =======================================================
     SINCRONIZAÇÃO DO CONTEÚDO
     ======================================================= */

  useEffect(() => {
    if (!editor) {
      return
    }

    const jsonContent =
      parseTiptapJson(
        value
      )

    if (jsonContent) {
      const currentJson =
        JSON.stringify(
          editor.getJSON()
        )

      const incomingJson =
        JSON.stringify(
          jsonContent
        )

      if (
        currentJson !==
        incomingJson
      ) {
        editor.commands.setContent(
          jsonContent,
          {
            emitUpdate:
              false,
          }
        )
      }

      return
    }

    const currentMarkdown =
      editor.getMarkdown()

    if (
      currentMarkdown !==
      value
    ) {
      editor.commands.setContent(
        value || "",
        {
          contentType:
            "markdown",

          emitUpdate:
            false,
        }
      )
    }
  }, [
    editor,
    value,
  ])

  const rect =
    useCursorVisibility({
      editor,

      overlayHeight:
        toolbarHeight,
    })

  const toolbarView:
    MobileView =
      isMobile
        ? mobileView
        : "main"

  /* =======================================================
     SEARCH & REPLACE
     ======================================================= */

  const openSearchAndReplace =
    useCallback(() => {
      setMobileView(
        "main"
      )

      setIsSearchAndReplaceOpen(
        true
      )
    }, [])

  const closeSearchAndReplace =
    useCallback(() => {
      setIsSearchAndReplaceOpen(
        false
      )

      searchAndReplaceButtonRef
        .current
        ?.focus()
    }, [])

  const toggleSearchAndReplace =
    useCallback(() => {
      if (
        isSearchAndReplaceOpen
      ) {
        closeSearchAndReplace()

        return
      }

      openSearchAndReplace()
    }, [
      closeSearchAndReplace,
      isSearchAndReplaceOpen,
      openSearchAndReplace,
    ])

  return (
    <div className="simple-editor-wrapper">
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

      <EditorContext.Provider
        value={{
          editor,
        }}
      >
        <Toolbar
          ref={
            toolbarRef
          }
          style={{
            ...(isMobile
              ? {
                  bottom:
                    `calc(100% - ${
                      height -
                      rect.y
                    }px)`,
                }
              : {}),
          }}
        >
          {toolbarView ===
          "main" ? (
            <MainToolbarContent
              editor={
                editor
              }
              onHighlighterClick={() =>
                setMobileView(
                  "highlighter"
                )
              }
              onSearchAndReplaceClick={
                toggleSearchAndReplace
              }
              isSearchAndReplaceOpen={
                isSearchAndReplaceOpen
              }
              searchAndReplaceButtonRef={
                searchAndReplaceButtonRef
              }
              isMobile={
                isMobile
              }
            />
          ) : (
            <MobileToolbarContent
              editor={
                editor
              }
              onBack={() =>
                setMobileView(
                  "main"
                )
              }
            />
          )}
        </Toolbar>

        <SearchAndReplace
          className="simple-editor-search-and-replace"
          open={
            isSearchAndReplaceOpen
          }
          onOpen={
            openSearchAndReplace
          }
          onClose={
            closeSearchAndReplace
          }
          scrollIntoViewOptions={
            SEARCH_AND_REPLACE_SCROLL_OPTIONS
          }
        />

        <EditorContent
          editor={
            editor
          }
          role="presentation"
          className="simple-editor-content"
        />
      </EditorContext.Provider>
    </div>
  )
}