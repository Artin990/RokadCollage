import React, { useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Filter({
  filterConfig = [],
  config = [],
  values = null,
  onFilterChange,
  className = "",
}) {
  const actualConfig = filterConfig?.length > 0 ? filterConfig : config || [];
  const [selectedFilters, setSelectedFilters] = useState(values || {});

  useEffect(() => {
    if (values) {
      setSelectedFilters(values);
    }
  }, [values]);

  const handleSelectChange = (field, value) => {
    const newFilters = { ...selectedFilters };
    if (value === "") {
      delete newFilters[field];
    } else {
      newFilters[field] = value;
    }
    setSelectedFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  if (!actualConfig || actualConfig.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {actualConfig.map((item, index) => {
        const isSelected = Boolean(selectedFilters[item.field]);
        return (
          <div
            key={item.field || index}
            className={`relative flex items-center h-10 min-h-[40px] rounded-xl border bg-surface transition-all duration-200 shadow-2xs group ${
              isSelected
                ? "border-primary/50 bg-primary-soft/50 ring-1 ring-primary/25"
                : "border-border hover:border-border-hover focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            }`}
          >
            {item.label && (
              <span className="text-xs font-bold text-text-muted select-none shrink-0 ps-3 pe-2 border-e border-border/70 flex items-center gap-1">
                <span>{item.label}:</span>
              </span>
            )}
            <select
              className={`h-full bg-transparent text-xs md:text-sm font-bold outline-none appearance-none cursor-pointer pe-7 ${
                item.label ? "ps-2" : "ps-3"
              } ${isSelected ? "text-primary-text font-black" : "text-text-primary"}`}
              value={selectedFilters[item.field] || ""}
              onChange={(e) => handleSelectChange(item.field, e.target.value)}
            >
              <option value="">همه</option>
              {(item.options || []).map((option, optIdx) => {
                const isObj = typeof option === "object" && option !== null;
                const val = isObj ? (option.value !== undefined ? option.value : option.id) : option;
                const lbl = isObj ? (option.label !== undefined ? option.label : (option.title || option.name)) : option;
                return (
                  <option key={optIdx} value={val !== undefined ? val : ""}>
                    {lbl}
                  </option>
                );
              })}
            </select>
            <div className="absolute end-2 flex items-center pointer-events-none text-text-muted group-hover:text-text-primary transition-colors">
              <KeyboardArrowDownIcon style={{ fontSize: "1.1rem" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
