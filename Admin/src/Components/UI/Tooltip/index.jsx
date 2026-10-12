import React, { useState } from "react";

/**
 * Lightweight Accessible Tooltip Component
 */
export function Tooltip({
  content,
  children,
  position = "top",
  className = "",
}) {
  const [visible, setVisible] = useState(false);

  if (!content) return children;

  const positionClasses = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-1.5",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1.5",
    left: "right-full top-1/2 -translate-y-1/2 me-1.5",
    right: "left-full top-1/2 -translate-y-1/2 ms-1.5",
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`
            absolute z-50 px-2 py-1 text-2xs font-medium text-white bg-secondary
            rounded-md shadow-md pointer-events-none whitespace-nowrap animate-fadeIn
            ${positionClasses[position] || positionClasses.top}
          `}
        >
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
