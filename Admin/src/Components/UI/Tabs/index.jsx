import React from "react";

/**
 * Standard Accessible Tabs Component
 * Reliably supports tab items defined with id, key, or value.
 */
export function Tabs({ tabs = [], activeTab, onChange, className = "" }) {
  const getTabKey = (tab) => tab?.id ?? tab?.key ?? tab?.value;

  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`flex items-center gap-2 border-b border-border overflow-x-auto hide-scrollbar ${className}`}
    >
      {tabs.map((tab, idx) => {
        const rawKey = getTabKey(tab) ?? idx;
        const isActive =
          activeTab !== undefined &&
          activeTab !== null &&
          rawKey !== undefined &&
          rawKey !== null &&
          String(activeTab) === String(rawKey);

        const tabDomId = `tab-${String(rawKey)}`;

        return (
          <button
            key={rawKey}
            role="tab"
            id={tabDomId}
            aria-selected={isActive}
            aria-controls={`panel-${String(rawKey)}`}
            type="button"
            onClick={() => onChange?.(rawKey)}
            className={`
              cursor-pointer pb-3.5 pt-1 px-4 font-bold text-xs md:text-sm flex items-center gap-2
              border-b-2 transition-all duration-200 outline-none select-none shrink-0 relative
              focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:rounded-t-lg
              ${
                isActive
                  ? "border-primary text-secondary font-black"
                  : "border-transparent text-text-muted hover:text-text-primary hover:border-border-hover/60"
              }
            `}
          >
            {tab.icon && (
              <span
                className={`transition-colors ${
                  isActive ? "text-primary" : "text-text-muted"
                }`}
              >
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-2xs font-semibold px-2 py-0.5 rounded-full transition-colors ${
                  isActive
                    ? "bg-primary-soft text-primary-text border border-primary-border"
                    : "bg-bg-light text-text-muted"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * SegmentedControl: Compact pill toggle (e.g. Desktop vs Mobile preview switcher)
 */
export function SegmentedControl({
  options = [],
  value,
  onChange,
  className = "",
  getLabel = (opt) => opt?.label || opt?.title || String(opt),
}) {
  const getOptKey = (opt) => opt?.id ?? opt?.value ?? opt?.key;

  return (
    <div
      role="radiogroup"
      className={`inline-flex items-center gap-1 bg-bg-light p-1 rounded-xl border border-border/80 ${className}`}
    >
      {options.map((opt, idx) => {
        const rawKey = getOptKey(opt) ?? idx;
        const isSelected =
          value !== undefined &&
          value !== null &&
          rawKey !== undefined &&
          rawKey !== null &&
          String(value) === String(rawKey);

        return (
          <button
            key={rawKey}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onChange?.(rawKey)}
            className={`
              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer outline-none select-none active:scale-95
              ${
                isSelected
                  ? "bg-surface text-secondary shadow-xs font-black border border-border/40"
                  : "text-text-muted hover:text-text-primary hover:bg-surface/60"
              }
            `}
          >
            {opt.icon && <span className="shrink-0">{opt.icon}</span>}
            <span>{opt.label || opt.title || String(rawKey)}</span>
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
