import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import type {
  RefObject,
} from "react"

import {
  type Editor,
} from "@tiptap/react"

// --- Hooks ---
import { useMenuNavigation } from "@/hooks/use-menu-navigation"
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { BanIcon } from "@/components/tiptap-icons/ban-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"

import { Button } from "@/components/tiptap-ui-primitive/button"

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/tiptap-ui-primitive/popover"

import { Separator } from "@/components/tiptap-ui-primitive/separator"

import {
  Card,
  CardBody,
  CardItemGroup,
} from "@/components/tiptap-ui-primitive/card"

import { ButtonGroup } from "@/components/tiptap-ui-primitive/button-group"

// --- Tiptap UI ---
import type {
  HighlightColor,
  UseColorHighlightConfig,
} from "@/components/tiptap-ui/color-highlight-button"

import {
  ColorHighlightButton,
  pickHighlightColorsByValue,
  useColorHighlight,
} from "@/components/tiptap-ui/color-highlight-button"


/* =========================================================
   CLICK OUTSIDE
   ========================================================= */

function useCloseOnOutsideClick(
  open: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  onClose: () => void
) {
  useEffect(() => {
    if (!open) {
      return
    }

    const handlePointerDown = (
      event: PointerEvent
    ) => {
      const target =
        event.target

      if (
        !(target instanceof Node)
      ) {
        return
      }

      const clickedTrigger =
        triggerRef.current?.contains(
          target
        )

      const clickedContent =
        contentRef.current?.contains(
          target
        )

      if (
        clickedTrigger ||
        clickedContent
      ) {
        return
      }

      onClose()
    }


    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (
        event.key === "Escape"
      ) {
        onClose()
      }
    }


    document.addEventListener(
      "pointerdown",
      handlePointerDown,
      true
    )

    document.addEventListener(
      "keydown",
      handleKeyDown,
      true
    )


    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown,
        true
      )

      document.removeEventListener(
        "keydown",
        handleKeyDown,
        true
      )
    }
  }, [
    open,
    triggerRef,
    contentRef,
    onClose,
  ])
}


export interface ColorHighlightPopoverContentProps {
  editor?:
    Editor | null

  colors?:
    HighlightColor[]

  useColorValue?:
    boolean
}


export interface ColorHighlightPopoverProps
  extends
    Omit<
      ButtonProps,
      "type"
    >,
    Pick<
      UseColorHighlightConfig,
      | "editor"
      | "hideWhenUnavailable"
      | "onApplied"
    > {
  colors?:
    HighlightColor[]

  useColorValue?:
    boolean
}


export const ColorHighlightPopoverButton =
  forwardRef<
    HTMLButtonElement,
    ButtonProps
  >(
    (
      {
        className,
        children,
        ...props
      },
      ref
    ) => (
      <Button
        type="button"
        className={
          className
        }
        variant="ghost"
        data-appearance="default"
        role="button"
        tabIndex={-1}
        aria-label="Highlight text"
        tooltip="Highlight"
        ref={ref}
        {...props}
      >
        {children ?? (
          <HighlighterIcon className="tiptap-button-icon" />
        )}
      </Button>
    )
  )


ColorHighlightPopoverButton.displayName =
  "ColorHighlightPopoverButton"


export function ColorHighlightPopoverContent({
  editor,

  colors =
    pickHighlightColorsByValue([
      "var(--tt-color-highlight-green)",
      "var(--tt-color-highlight-blue)",
      "var(--tt-color-highlight-red)",
      "var(--tt-color-highlight-purple)",
      "var(--tt-color-highlight-yellow)",
    ]),

  useColorValue =
    false,
}: ColorHighlightPopoverContentProps) {
  const {
    handleRemoveHighlight,
  } =
    useColorHighlight({
      editor,
    })

  const isMobile =
    useIsBreakpoint()

  const containerRef =
    useRef<HTMLDivElement>(
      null
    )


  const menuItems =
    useMemo(
      () => [
        ...colors,
        {
          label:
            "Remove highlight",

          value:
            "none",
        },
      ],
      [
        colors,
      ]
    )


  const {
    selectedIndex,
  } =
    useMenuNavigation({
      containerRef,

      items:
        menuItems,

      orientation:
        "both",

      onSelect: (
        item
      ) => {
        if (
          !containerRef.current
        ) {
          return false
        }

        const highlightedElement =
          containerRef.current.querySelector(
            '[data-highlighted="true"]'
          ) as HTMLElement | null

        if (
          highlightedElement
        ) {
          highlightedElement.click()
        }

        if (
          item.value === "none"
        ) {
          handleRemoveHighlight()
        }

        return true
      },

      autoSelectFirstItem:
        false,
    })


  return (
    <Card
      ref={
        containerRef
      }
      tabIndex={
        0
      }
      style={
        isMobile
          ? {
              boxShadow:
                "none",

              border:
                0,
            }
          : {}
      }
    >
      <CardBody
        style={
          isMobile
            ? {
                padding:
                  0,
              }
            : {}
        }
      >
        <CardItemGroup
          orientation="horizontal"
        >
          <ButtonGroup>
            {colors.map(
              (
                color,
                index
              ) => (
                <ButtonGroup
                  key={
                    color.value
                  }
                >
                  <ColorHighlightButton
                    editor={
                      editor
                    }
                    highlightColor={
                      useColorValue
                        ? color.colorValue
                        : color.value
                    }
                    tooltip={
                      color.label
                    }
                    aria-label={`${color.label} highlight color`}
                    tabIndex={
                      index ===
                      selectedIndex
                        ? 0
                        : -1
                    }
                    data-highlighted={
                      selectedIndex ===
                      index
                    }
                    useColorValue={
                      useColorValue
                    }
                  />
                </ButtonGroup>
              )
            )}
          </ButtonGroup>

          <Separator />

          <ButtonGroup>
            <Button
              onClick={
                handleRemoveHighlight
              }
              aria-label="Remove highlight"
              tooltip="Remove highlight"
              tabIndex={
                selectedIndex ===
                colors.length
                  ? 0
                  : -1
              }
              type="button"
              role="menuitem"
              variant="ghost"
              data-highlighted={
                selectedIndex ===
                colors.length
              }
            >
              <BanIcon className="tiptap-button-icon" />
            </Button>
          </ButtonGroup>
        </CardItemGroup>
      </CardBody>
    </Card>
  )
}


export function ColorHighlightPopover({
  editor:
    providedEditor,

  colors =
    pickHighlightColorsByValue([
      "var(--tt-color-highlight-green)",
      "var(--tt-color-highlight-blue)",
      "var(--tt-color-highlight-red)",
      "var(--tt-color-highlight-purple)",
      "var(--tt-color-highlight-yellow)",
    ]),

  hideWhenUnavailable =
    false,

  useColorValue =
    false,

  onApplied,

  ...props
}: ColorHighlightPopoverProps) {
  const {
    editor,
  } =
    useTiptapEditor(
      providedEditor
    )

  const [
    isOpen,
    setIsOpen,
  ] =
    useState(false)

  const triggerRef =
    useRef<HTMLButtonElement>(
      null
    )

  const contentRef =
    useRef<HTMLDivElement>(
      null
    )


  const closePopover =
    useCallback(() => {
      setIsOpen(false)
    }, [])


  useCloseOnOutsideClick(
    isOpen,
    triggerRef,
    contentRef,
    closePopover
  )


  const {
    isVisible,
    canColorHighlight,
    isActive,
    label,
    Icon,
  } =
    useColorHighlight({
      editor,
      hideWhenUnavailable,
      onApplied,
    })


  if (
    !isVisible
  ) {
    return null
  }


  return (
    <Popover
      open={
        isOpen
      }
      onOpenChange={
        setIsOpen
      }
    >
      <PopoverTrigger
        asChild
      >
        <ColorHighlightPopoverButton
          ref={
            triggerRef
          }
          disabled={
            !canColorHighlight
          }
          data-active-state={
            isActive
              ? "on"
              : "off"
          }
          data-disabled={
            !canColorHighlight
          }
          aria-pressed={
            isActive
          }
          aria-label={
            label
          }
          tooltip={
            label
          }
          {...props}
        >
          <Icon className="tiptap-button-icon" />
        </ColorHighlightPopoverButton>
      </PopoverTrigger>

      <PopoverContent
        aria-label="Highlight colors"
        onInteractOutside={
          closePopover
        }
        onEscapeKeyDown={
          closePopover
        }
      >
        <div
          ref={
            contentRef
          }
        >
          <ColorHighlightPopoverContent
            editor={
              editor
            }
            colors={
              colors
            }
            useColorValue={
              useColorValue
            }
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}


export default ColorHighlightPopover