import React, { useState, useEffect, useRef } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import VOCAB from "../../../Constants/vocab";

export function SearchInput({
  onSearch,
  placeholder = VOCAB.search,
  className = "",
  defaultValue = "",
  debounceMs = 350,
}) {
  const [searchTerm, setSearchTerm] = useState(defaultValue || "");
  const onSearchRef = useRef(onSearch);
  const lastEmittedValue = useRef(defaultValue || "");

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== searchTerm) {
      setSearchTerm(defaultValue);
      lastEmittedValue.current = defaultValue;
    }
  }, [defaultValue]);

  useEffect(() => {
    if (searchTerm === lastEmittedValue.current) {
      return;
    }

    const timer = setTimeout(() => {
      lastEmittedValue.current = searchTerm;
      if (onSearchRef.current) {
        onSearchRef.current(searchTerm);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchTerm, debounceMs]);

  const handleClear = () => {
    setSearchTerm("");
    lastEmittedValue.current = "";
    if (onSearchRef.current) {
      onSearchRef.current("");
    }
  };

  return (
    <div className={`relative w-full ${className}`}>
      {/* Search Icon at Start */}
      <div className="absolute inset-y-0 start-3 flex items-center pointer-events-none text-text-muted">
        <SearchIcon style={{ fontSize: "1.15rem" }} />
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full h-10 min-h-[40px] ps-10 pe-10 rounded-xl text-xs md:text-sm bg-surface text-text-primary placeholder:text-text-muted border border-border hover:border-border-hover focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all duration-200 outline-none shadow-xs truncate placeholder:truncate"
      />

      {/* Clear Button at End */}
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          title="پاک‌کردن متن جستجو"
          aria-label="پاک‌کردن متن جستجو"
          className="absolute inset-y-0 end-2.5 my-auto h-6 w-6 rounded-md flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-light transition-colors cursor-pointer"
        >
          <CloseIcon style={{ fontSize: "1rem" }} />
        </button>
      )}
    </div>
  );
}

export default SearchInput;
