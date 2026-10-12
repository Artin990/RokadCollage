import React from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchInput from "../SearchInput";
import Filter from "../../Filter";
import { IconButton } from "../Button";
import VOCAB from "../../../Constants/vocab";

export function Toolbar({
  searchPlaceholder = VOCAB.search,
  onSearch,
  searchValue = "",
  filterConfig = [],
  onFilterChange,
  filters = null,
  onRefresh,
  isRefreshing = false,
  actions = null,
  start = null,
  children,
  className = "",
}) {
  return (
    <div
      className={`bg-surface p-2.5 sm:p-3.5 rounded-2xl border border-border/80 shadow-xs flex flex-col md:flex-row gap-2.5 sm:gap-3 items-stretch md:items-center justify-between ${className}`}
    >
      {/* Main search and controls area */}
      <div className="flex-1 flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-2.5 items-stretch sm:items-center min-w-0">
        {start}

        {/* Search input + Mobile-inline Refresh button (stays in one row on mobile) */}
        {(onSearch || onRefresh || actions) && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            {onSearch && (
              <div className="flex-1 sm:w-72 md:w-80 lg:w-96 shrink-0 min-w-0 max-w-full">
                <SearchInput
                  placeholder={searchPlaceholder}
                  onSearch={onSearch}
                  defaultValue={searchValue}
                />
              </div>
            )}

            {/* Mobile-only inline actions & refresh button (prevent dropping to bottom) */}
            <div className="flex md:hidden items-center gap-1.5 shrink-0">
              {actions}
              {onRefresh && (
                <IconButton
                  icon={
                    <RefreshIcon
                      fontSize="small"
                      className={isRefreshing ? "animate-spin text-primary" : ""}
                    />
                  }
                  title={VOCAB.refresh}
                  aria-label={VOCAB.refresh}
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  variant="ghost"
                  size="md"
                  className="hover:text-primary hover:bg-primary-soft text-text-secondary"
                />
              )}
            </div>
          </div>
        )}

        {/* Filters */}
        {filters ? (
          <div className="w-full sm:w-auto overflow-x-auto hide-scrollbar">{filters}</div>
        ) : filterConfig && filterConfig.length > 0 ? (
          <div className="w-full sm:w-auto overflow-x-auto hide-scrollbar">
            <Filter
              filterConfig={filterConfig}
              onFilterChange={onFilterChange}
            />
          </div>
        ) : null}

        {children}
      </div>

      {/* Desktop-only End / Right side actions & refresh button */}
      {(onRefresh || actions) && (
        <div className="hidden md:flex items-center justify-end gap-2 shrink-0 border-s border-border/70 ps-3">
          {actions}

          {onRefresh && (
            <IconButton
              icon={
                <RefreshIcon
                  fontSize="small"
                  className={isRefreshing ? "animate-spin text-primary" : ""}
                />
              }
              title={VOCAB.refresh}
              aria-label={VOCAB.refresh}
              onClick={onRefresh}
              disabled={isRefreshing}
              variant="ghost"
              size="md"
              className="hover:text-primary hover:bg-primary-soft text-text-secondary"
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Toolbar;
