import React, { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { fetchTeachers, fetchTeacherById } from "../../Pages/Teacher/api/teacherApi";
import Loading from "../Loading";
import SelectedTeachersBadges from "./SelectedTeachersBadges";
import TeacherDropdown from "./TeacherDropdown";

export default function TeacherSelect({
  value = [], // Array of teacher IDs or teacher objects
  onChange,
  error,
  label = "معلمان و اساتید دوره",
  helperText = "با تایپ نام یا تخصص، معلمان موجود را جستجو و به دوره متصل کنید",
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDetails, setSelectedDetails] = useState([]);
  const dropdownRef = useRef(null);

  // Normalize selected IDs
  const selectedIds = (value || []).map((t) => (typeof t === "object" ? t._id : t));

  // Fetch full details of initially selected teachers if they are only IDs
  useEffect(() => {
    const fetchSelectedTeachers = async () => {
      if (!value || value.length === 0) {
        setSelectedDetails([]);
        return;
      }

      // Check if value already contains full objects
      const isFullObjects = value.every((t) => typeof t === "object" && t.name);
      if (isFullObjects) {
        setSelectedDetails(value);
        return;
      }

      try {
        const promises = selectedIds.map((id) =>
          fetchTeacherById(id)
            .then((res) => (res.data ? (Array.isArray(res.data) ? res.data[0] : res.data) : null))
            .catch(() => null)
        );
        const resolved = await Promise.all(promises);
        setSelectedDetails(resolved.filter(Boolean));
      } catch (err) {
        // Handled silently
      }
    };

    fetchSelectedTeachers();
  }, [value.length]);

  // Search teachers with debounce
  useEffect(() => {
    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const params = query.trim()
          ? { q: query.trim(), limit: 10 }
          : { limit: 10, sort: "-_id" };

        const res = await fetchTeachers(params);
        if (active && res && res.success !== false) {
          const list = Array.isArray(res) ? res : res.data || [];
          setResults(list);
        }
      } catch (err) {
        // Handled silently
      } finally {
        if (active) setLoading(false);
      }
    }, 300);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query]);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (teacher) => {
    const alreadySelected = selectedIds.includes(teacher._id);
    let newIds = [];
    let newDetails = [];

    if (alreadySelected) {
      newIds = selectedIds.filter((id) => id !== teacher._id);
      newDetails = selectedDetails.filter((t) => t._id !== teacher._id);
    } else {
      newIds = [...selectedIds, teacher._id];
      newDetails = [...selectedDetails, teacher];
    }

    setSelectedDetails(newDetails);
    if (onChange) {
      onChange(newIds);
    }
  };

  const handleRemove = (teacherId) => {
    const newIds = selectedIds.filter((id) => id !== teacherId);
    const newDetails = selectedDetails.filter((t) => t._id !== teacherId);
    setSelectedDetails(newDetails);
    if (onChange) {
      onChange(newIds);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full text-right" ref={dropdownRef}>
      {label && (
        <div className="flex flex-wrap items-center justify-between gap-1 select-none">
          <label className="text-xs md:text-sm font-semibold text-text-primary">
            {label}
          </label>
          <span className="text-[11px] text-text-muted">
            {selectedDetails.length > 0
              ? `${selectedDetails.length} معلم انتخاب شده`
              : "هیچ معلمی انتخاب نشده"}
          </span>
        </div>
      )}

      {/* Selected Teachers Cards */}
      <div className="flex flex-wrap gap-2.5 min-h-[46px] p-3 bg-bg-light/60 rounded-2xl border border-border/70">
        <SelectedTeachersBadges
          selectedDetails={selectedDetails}
          onRemove={handleRemove}
        />
      </div>

      {/* Search Input Box */}
      <div className="relative w-full">
        <div className="relative flex items-center">
          <div className="absolute start-3 flex items-center pointer-events-none text-text-muted">
            <SearchIcon style={{ fontSize: "1.15rem" }} />
          </div>

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder="جستجوی نام یا تخصص استاد..."
            className={`
              w-full h-10 min-h-[40px] ps-10 pe-10 rounded-xl text-xs md:text-sm bg-surface text-text-primary placeholder:text-text-muted
              border transition-all duration-200 outline-none truncate placeholder:truncate shadow-xs
              ${
                error
                  ? "border-error focus:border-error focus:ring-2 focus:ring-error/20"
                  : "border-border hover:border-border-hover focus:border-primary focus:ring-2 focus:ring-primary/20"
              }
            `}
          />

          {loading && (
            <div className="absolute end-3.5 flex items-center">
              <Loading size={6} />
            </div>
          )}
        </div>

        {/* Dropdown Options List */}
        <TeacherDropdown
          isOpen={isOpen}
          results={results}
          selectedIds={selectedIds}
          query={query}
          onSelect={handleSelect}
        />
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
