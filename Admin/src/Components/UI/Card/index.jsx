import React from "react";

export function Card({
  children,
  className = "",
  hoverable = false,
  onClick,
  ...props
}) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-surface rounded-2xl border border-border/80 shadow-xs
        transition-all duration-200
        ${
          hoverable
            ? "hover:shadow-md hover:border-border cursor-pointer hover:-translate-y-0.5"
            : ""
        }
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * SectionCard: Form and content section with title, subtitle, and divider.
 */
export function SectionCard({
  title,
  subtitle = null,
  action = null,
  children,
  className = "",
  headerClassName = "",
  ...props
}) {
  return (
    <Card className={`p-4 sm:p-6 md:p-7 flex flex-col gap-4 sm:gap-5 ${className}`} {...props}>
      {(title || subtitle || action) && (
        <div
          className={`flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 border-b border-border/80 pb-3.5 sm:pb-4 ${headerClassName}`}
        >
          <div className="flex flex-col gap-1">
            {title && (
              <h2 className="text-base md:text-lg font-black text-secondary tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-text-muted leading-relaxed font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="w-full">{children}</div>
    </Card>
  );
}

export default Card;
