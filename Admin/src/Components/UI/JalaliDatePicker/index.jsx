import React, { useMemo, useRef } from "react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian.js";
import persian_fa from "react-date-object/locales/persian_fa.js";
import TimePicker from "react-multi-date-picker/plugins/time_picker.js";
import Toolbar from "react-multi-date-picker/plugins/toolbar.js";
import DateObject from "react-date-object";
import { Calendar as CalendarIcon, X as CloseIcon } from "lucide-react";
import "./datepicker.css";

export const JalaliDatePicker = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  placeholder = "انتخاب تاریخ و ساعت...",
  withTime = true,
  disabled = false,
  className = "",
  id,
}) => {
  const inputId = id || name;
  const datePickerRef = useRef(null);

  // Parse Gregorian ISO string or Date into DateObject in Persian calendar
  const datePickerValue = useMemo(() => {
    if (!value) return null;
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) return null;
    return new DateObject({
      date: d,
      calendar: persian,
      locale: persian_fa,
    });
  }, [value]);

  // Handle date change and emit standard ISO 8601 string
  const handleChange = (date) => {
    if (!date) {
      if (onChange) onChange("");
      return;
    }
    const jsDate = date instanceof DateObject ? date.toDate() : new Date(date);
    if (isNaN(jsDate.getTime())) {
      if (onChange) onChange("");
      return;
    }
    const isoString = jsDate.toISOString();
    if (onChange) onChange(isoString);
  };

  // Handle direct clear from input button
  const handleClear = (e) => {
    e.stopPropagation();
    if (datePickerRef.current?.closeCalendar) {
      datePickerRef.current.closeCalendar();
    }
    if (onChange) onChange("");
  };

  // Configure plugins: TimePicker (if withTime) and Toolbar
  const plugins = useMemo(() => {
    const list = [];
    if (withTime) {
      list.push(
        <TimePicker
          position="bottom"
          hideSeconds={true}
          hStep={1}
          mStep={5}
        />
      );
    }
    list.push(
      <Toolbar
        position="bottom"
        names={{
          today: "امروز / الان",
          deselect: "پاک کردن",
          close: "تأیید",
        }}
        sort={["today", "deselect", "close"]}
      />
    );
    return list;
  }, [withTime]);

  return (
    <div
      dir="rtl"
      className={`relative flex flex-col gap-1.5 w-full text-right ${className}`}
    >
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs md:text-sm font-semibold text-text-primary select-none flex items-center justify-between"
        >
          <span>{label}</span>
        </label>
      )}

      {/* DatePicker Component */}
      <DatePicker
        ref={datePickerRef}
        calendar={persian}
        locale={persian_fa}
        calendarPosition="bottom-right"
        format={withTime ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD"}
        value={datePickerValue}
        onChange={handleChange}
        onClose={() => onBlur && onBlur({ target: { name } })}
        disabled={disabled}
        plugins={plugins}
        containerClassName="w-full relative flex flex-col"
        className="rokad-datepicker-theme"
        render={(formattedValue, openCalendar) => (
          <div className="relative flex items-center w-full">
            {/* Calendar Icon on start */}
            <div className="absolute start-3.5 flex items-center pointer-events-none text-text-muted z-10">
              <CalendarIcon className="w-4 h-4 text-text-muted" />
            </div>

            {/* Custom Input Trigger */}
            <button
              type="button"
              id={inputId}
              name={name}
              disabled={disabled}
              onClick={openCalendar}
              className={`
                w-full h-10 min-h-[40px] py-2 ps-10 pe-10 rounded-xl text-sm bg-surface text-text-primary text-right transition-all duration-200 outline-none
                border cursor-pointer select-none flex items-center justify-between
                disabled:bg-bg-subtle disabled:text-text-muted disabled:cursor-not-allowed
                ${
                  error
                    ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
                    : "border-border hover:border-border-hover focus:border-primary focus:ring-2 focus:ring-primary/20"
                }
              `}
            >
              <span
                className={`truncate text-sm font-normal ${
                  formattedValue ? "text-text-primary" : "text-text-muted"
                }`}
              >
                {formattedValue || placeholder}
              </span>
            </button>

            {/* Clear Button on end */}
            {formattedValue && !disabled && (
              <div className="absolute end-3 flex items-center gap-1.5 z-10">
                <button
                  type="button"
                  onClick={handleClear}
                  title="پاک کردن تاریخ"
                  className="p-1 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                >
                  <CloseIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      />

      {/* Error / Helper text */}
      {error && (
        <span className="text-xs text-error font-medium animate-fadeIn">
          {error}
        </span>
      )}
      {!error && helperText && (
        <span className="text-xs text-text-muted">{helperText}</span>
      )}
    </div>
  );
};
