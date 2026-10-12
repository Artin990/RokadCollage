import React, { forwardRef } from "react";
import Loading from "../../Loading";

export const Button = forwardRef(
  (
    {
      children,
      type = "button",
      variant = "primary",
      size = "md",
      isLoading = false,
      loading = false,
      disabled = false,
      icon = null,
      className = "",
      onClick,
      ...props
    },
    ref
  ) => {
    const isSpinning = isLoading || loading;
    const baseClasses =
      "inline-flex items-center justify-center font-bold select-none cursor-pointer transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 relative overflow-hidden shrink-0";

    const sizeClasses = {
      xs: "text-2xs px-2.5 h-7 min-h-[28px] rounded-lg gap-1",
      sm: "text-xs px-3.5 h-8 min-h-[32px] rounded-lg gap-1.5",
      md: "text-xs md:text-sm px-4.5 h-10 min-h-[40px] rounded-xl gap-2",
      lg: "text-sm md:text-base px-6 h-12 min-h-[48px] rounded-xl gap-2.5",
    };

    const variantClasses = {
      primary:
        "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-active shadow-xs hover:shadow-sm font-black",
      secondary:
        "border border-border bg-surface text-text-primary hover:bg-surface-hover hover:border-border-hover active:bg-bg-light shadow-xs",
      outline:
        "border border-border bg-surface text-text-primary hover:bg-surface-hover hover:border-border-hover active:bg-bg-light shadow-xs",
      ghost:
        "text-text-secondary hover:bg-surface-hover hover:text-text-primary active:bg-bg-light",
      danger:
        "bg-error text-white hover:bg-error-hover active:bg-error-hover/90 shadow-xs",
      "danger-outline":
        "border border-error-border bg-error-light text-error-text hover:bg-error-border/40 active:bg-error-border/60",
      "danger-ghost":
        "text-error hover:bg-error-light active:bg-error-border/40",
      "info-ghost":
        "text-info hover:bg-info-light active:bg-info-border/40",
      "primary-subtle":
        "bg-primary-soft text-primary-text hover:bg-primary-muted border border-primary-border",
    };

    const isInteractionDisabled = disabled || isSpinning;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isInteractionDisabled}
        onClick={onClick}
        className={`
          ${baseClasses}
          ${sizeClasses[size] || sizeClasses.md}
          ${variantClasses[variant] || variantClasses.primary}
          ${isInteractionDisabled ? "!pointer-events-none" : "active:scale-[0.98]"}
          ${className}
        `}
        {...props}
      >
        {isSpinning ? (
          <>
            <span className="invisible flex items-center gap-2">
              {icon && <span className="shrink-0">{icon}</span>}
              {children}
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <Loading
                size={size === "sm" ? 5 : 7}
                color={
                  variant === "primary"
                    ? "var(--color-on-primary, #1b234d)"
                    : variant === "danger"
                    ? "#ffffff"
                    : "var(--color-primary, #F8A41D)"
                }
              />
            </div>
          </>
        ) : (
          <>
            {icon && <span className="shrink-0 flex items-center">{icon}</span>}
            {children && <span>{children}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

/**
 * IconButton: Accessible icon-only button with mandatory aria-label and tooltip.
 * Standard 40px touch-target min dimensions.
 */
export const IconButton = forwardRef(
  (
    {
      icon,
      title,
      "aria-label": ariaLabel,
      variant = "ghost",
      size = "md",
      className = "",
      isLoading = false,
      loading = false,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const accessibleLabel = ariaLabel || title;

    const sizeClasses = {
      xs: "w-7 h-7 min-w-[28px] min-h-[28px] p-1 rounded-md text-xs",
      sm: "w-8 h-8 min-w-[32px] min-h-[32px] p-1.5 rounded-lg text-xs",
      md: "w-10 h-10 min-w-[40px] min-h-[40px] p-2 rounded-xl text-sm",
      lg: "w-12 h-12 min-w-[48px] min-h-[48px] p-2.5 rounded-xl text-base",
    };

    // When variant is "danger", use "danger-ghost" so icon buttons harmonize cleanly with ghost icon buttons
    const resolvedVariant = variant === "danger" ? "danger-ghost" : variant;

    return (
      <Button
        ref={ref}
        variant={resolvedVariant}
        size={size}
        isLoading={isLoading || loading}
        disabled={disabled}
        title={title || ariaLabel}
        aria-label={accessibleLabel}
        className={`!p-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";

export default Button;
