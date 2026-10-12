import React from "react";

/**
 * TableContainer: Standardized high-contrast, rounded container for tables
 * with responsive horizontal scroll and shadow.
 */
export function TableContainer({ children, className = "", ...props }) {
  return (
    <div
      className={`w-full overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-2xs ${className}`}
      {...props}
    >
      <div className="overflow-x-auto w-full overscroll-contain custom-scrollbar">
        {children}
      </div>
    </div>
  );
}

/**
 * Table: Standard semantic HTML table with Persian RTL alignment and consistent typography.
 */
export function Table({ children, className = "", ...props }) {
  return (
    <table
      className={`w-full text-right border-collapse text-xs md:text-sm select-text ${className}`}
      {...props}
    >
      {children}
    </table>
  );
}

/**
 * TableHead: Unified table header with subtle background, sticky support, and crisp border.
 */
export function TableHead({ children, className = "", ...props }) {
  return (
    <thead
      className={`bg-bg-subtle/90 text-text-secondary border-b border-border/80 font-bold select-none ${className}`}
      {...props}
    >
      {children}
    </thead>
  );
}

/**
 * TableRow: Table row with unified, warm brand hover transition (hover:bg-primary-soft/30).
 */
export function TableRow({
  children,
  className = "",
  isHeader = false,
  hover = true,
  ...props
}) {
  return (
    <tr
      className={`
        ${!isHeader && hover ? "hover:bg-primary-soft/35 transition-colors duration-150 group" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </tr>
  );
}

/**
 * TableHeadCell: Unified <th> element with strict 14px/3.5rem vertical padding.
 */
export function TableHeadCell({
  children,
  className = "",
  align = "right",
  ...props
}) {
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "left"
      ? "text-left"
      : "text-right";

  return (
    <th
      className={`py-3.5 px-4 font-extrabold text-secondary tracking-tight text-xs md:text-[13px] whitespace-nowrap ${alignClass} ${className}`}
      {...props}
    >
      {children}
    </th>
  );
}

/**
 * TableCell: Unified <td> element with strict 14px/3.5rem vertical padding and vertical centering.
 */
export function TableCell({
  children,
  className = "",
  align = "right",
  ...props
}) {
  const alignClass =
    align === "center"
      ? "text-center"
      : align === "left"
      ? "text-left"
      : "text-right";

  return (
    <td
      className={`py-3.5 px-3.5 sm:px-4 text-text-primary align-middle text-xs md:text-sm whitespace-nowrap ${alignClass} ${className}`}
      {...props}
    >
      {children}
    </td>
  );
}

/**
 * TableBody: Unified <tbody> element with consistent row dividers.
 */
export function TableBody({ children, className = "", ...props }) {
  return (
    <tbody className={`divide-y divide-border/60 ${className}`} {...props}>
      {children}
    </tbody>
  );
}

export default Table;
