import React from "react";
import { BeatLoader } from "react-spinners";

export default function Loading({
  color = "var(--color-primary, #F8A41D)",
  size = 8,
  margin = 2,
  className = "",
  container = false,
  overlay = false,
  text = "",
  minHeight = "min-h-[180px] sm:min-h-[220px]",
}) {
  if (overlay) {
    return (
      <div
        className={`absolute inset-0 z-20 flex flex-col items-center justify-center gap-2.5 bg-surface/80 backdrop-blur-[2px] rounded-2xl transition-all duration-200 select-none ${className}`}
      >
        <div className="w-10 h-10 rounded-xl bg-primary-soft/80 flex items-center justify-center text-primary shadow-2xs border border-primary-border/60">
          <BeatLoader size={size} color={color} margin={margin} />
        </div>
        {text && (
          <span className="text-xs text-text-secondary font-bold">
            {text}
          </span>
        )}
      </div>
    );
  }

  if (container) {
    return (
      <div
        className={`w-full ${minHeight} flex flex-col items-center justify-center gap-2.5 rounded-2xl bg-bg-light/30 border border-dashed border-border/80 p-6 transition-all duration-200 select-none ${className}`}
      >
        <div className="w-10 h-10 rounded-xl bg-primary-soft/80 flex items-center justify-center text-primary shadow-2xs border border-primary-border/60">
          <BeatLoader size={size} color={color} margin={margin} />
        </div>
        {text && (
          <span className="text-xs text-text-muted font-bold">
            {text}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`inline-flex justify-center items-center ${className}`}>
      <BeatLoader size={size} color={color} margin={margin} />
    </div>
  );
}
