import React, { forwardRef, useState, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export const Select = forwardRef(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = "انتخاب کنید",
      children,
      className = "",
      id,
      name,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const selectId = id || name;
    const isControlled = value !== undefined;

    // Internal state for uncontrolled mode or fallback
    const [internalValue, setInternalValue] = useState(() => {
      if (value !== undefined && value !== null) {
        if (typeof value === "object") {
          return value.target?.value ?? value.value ?? value.id ?? "";
        }
        return String(value);
      }
      return defaultValue !== undefined && defaultValue !== null ? String(defaultValue) : "";
    });

    // Sync internal state when controlled value prop updates
    useEffect(() => {
      if (value !== undefined && value !== null) {
        let val = value;
        if (typeof value === "object") {
          val = value.target?.value ?? value.value ?? value.id ?? "";
        }
        setInternalValue(String(val));
      }
    }, [value]);

    // Safely resolve the value to bind to <select value={resolvedValue}>
    let resolvedValue;
    if (isControlled) {
      if (typeof value === "object" && value !== null) {
        if (value.target && value.target.value !== undefined) {
          resolvedValue = value.target.value;
        } else if (value.value !== undefined) {
          resolvedValue = value.value;
        } else if (value.id !== undefined) {
          resolvedValue = value.id;
        } else {
          resolvedValue = "";
        }
      } else if (value === null) {
        resolvedValue = "";
      } else {
        resolvedValue = value;
      }
    } else {
      resolvedValue = internalValue;
    }

    const handleSelectChange = (e) => {
      const rawVal = e.target.value;
      setInternalValue(rawVal);

      if (!onChange) return;

      // Detect if caller expects an event or a direct value
      const fnStr = typeof onChange === "function" ? onChange.toString() : "";
      const isFormikHandleChange =
        onChange.name === "handleChange" || Boolean(onChange._isFormik);
      const accessesTarget =
        fnStr.includes(".target") ||
        fnStr.includes("target.value") ||
        fnStr.includes("currentTarget");
      const isParamNamedEvent =
        /^\s*(async\s*)?(\(?\s*(e|evt|event)\s*(\)|=>|,))/i.test(fnStr);

      if (isFormikHandleChange || accessesTarget || isParamNamedEvent) {
        // Standard event handler
        onChange(e, rawVal);
      } else if (onChange.length === 1) {
        // Single param callback expecting value: (val) => setFieldValue('x', val)
        onChange(rawVal, e);
      } else {
        // Default to standard (e, rawVal)
        onChange(e, rawVal);
      }
    };

    const hasEmptyOption = options.some((opt) => {
      const val = typeof opt === "object" && opt !== null ? (opt.value ?? opt.id) : opt;
      return val === "";
    });

    return (
      <div className="flex flex-col gap-1.5 w-full text-right">
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs md:text-sm font-semibold text-text-primary select-none"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center w-full">
          <select
            ref={ref}
            id={selectId}
            name={name}
            value={resolvedValue}
            onChange={handleSelectChange}
            className={`
              w-full h-10 min-h-[40px] py-2 pe-9 ps-3.5 rounded-xl text-sm bg-surface text-text-primary
              border transition-all duration-200 outline-none appearance-none cursor-pointer
              disabled:bg-bg-subtle disabled:text-text-muted disabled:cursor-not-allowed
              ${
                error
                  ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
                  : "border-border hover:border-border-hover focus:border-primary focus:ring-2 focus:ring-primary/20"
              }
              ${className}
            `}
            {...props}
          >
            {placeholder && !hasEmptyOption && <option value="">{placeholder}</option>}
            {children
              ? children
              : options.map((option, index) => {
                  const isObj = typeof option === "object" && option !== null;
                  const val = isObj
                    ? option.value !== undefined
                      ? option.value
                      : option.id
                    : option;
                  const lbl = isObj
                    ? option.label !== undefined
                      ? option.label
                      : option.title || option.name
                    : option;
                  return (
                    <option key={index} value={val !== undefined ? val : ""}>
                      {lbl}
                    </option>
                  );
                })}
          </select>

          <div className="absolute end-3 flex items-center pointer-events-none text-text-muted">
            <KeyboardArrowDownIcon fontSize="small" />
          </div>
        </div>

        {error && (
          <span className="text-xs text-error font-medium animate-fadeIn">
            {error}
          </span>
        )}

        {!error && helperText && (
          <span className="text-xs text-text-muted font-normal">
            {helperText}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
