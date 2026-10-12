import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Button from "../Button";

export function PageHeader({
  title,
  subtitle = null,
  action = null,
  backTo = null,
  backLabel = "بازگشت",
  onBack = null,
  showBack = false,
  forceBackTo = false,
  children = null,
  className = "",
}) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    if (forceBackTo && backTo) {
      navigate(backTo);
      return;
    }

    // Always prioritize navigating back to where the user came from
    const hasHistory =
      (window.history.state && typeof window.history.state.idx === "number" && window.history.state.idx > 0) ||
      window.history.length > 1;

    if (hasHistory) {
      navigate(-1);
    } else if (backTo) {
      navigate(backTo);
    } else {
      navigate("/");
    }
  };

  const showBackButton = Boolean(backTo || onBack || showBack);

  return (
    <div className={`flex flex-col mb-6 sm:mb-8 border-b border-border/80 pb-4 sm:pb-5 gap-4 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-3 sm:gap-4">
        <div className="flex flex-col gap-1 min-w-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-secondary tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs md:text-sm text-text-secondary font-medium leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
          {action}

          {showBackButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              icon={<ArrowForwardIcon fontSize="small" />}
              className="text-text-secondary hover:text-secondary font-semibold shrink-0"
            >
              {backLabel}
            </Button>
          )}
        </div>
      </div>

      {children && (
        <div className="w-full">
          {children}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
