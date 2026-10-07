import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { html } from "@codemirror/lang-html";

/**
 * Low-level HTML CodeMirror 6 editor wrapper.
 * Configured with LTR code direction, line numbers, line wrapping and custom height.
 */
export default function HtmlCodeEditor({
  value,
  onChange,
  placeholder = "کد HTML مقاله را اینجا وارد یا پیست کنید...",
  disabled = false,
  minHeight = "450px",
}) {
  return (
    <div
      dir="ltr"
      className="w-full rounded-xl overflow-hidden border border-border bg-white shadow-xs focus-within:ring-2 focus-within:ring-primary/40 focus-within:border-primary transition-all text-left font-mono"
    >
      <CodeMirror
        value={value || ""}
        height={minHeight}
        theme="light"
        extensions={[html()]}
        onChange={(val) => onChange && onChange(val)}
        editable={!disabled}
        placeholder={placeholder}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLineGutter: true,
          highlightSpecialChars: true,
          history: true,
          foldGutter: true,
          drawSelection: true,
          dropCursor: true,
          allowMultipleSelections: true,
          indentOnInput: true,
          syntaxHighlighting: true,
          bracketMatching: true,
          closeBrackets: true,
          autocompletion: true,
          rectangularSelection: true,
          crosshairCursor: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          closeBracketsKeymap: true,
          defaultKeymap: true,
          searchKeymap: true,
          historyKeymap: true,
          foldKeymap: true,
          completionKeymap: true,
          lintKeymap: true,
        }}
        style={{
          fontSize: "13.5px",
        }}
      />
    </div>
  );
}
