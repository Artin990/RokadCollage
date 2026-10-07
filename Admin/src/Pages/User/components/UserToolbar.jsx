import React from "react";
import Search from "../../../Components/Search";
import Filter from "../../../Components/Filter";
import { Card } from "../../../Components/UI";

export default function UserToolbar({ roleFilterConfig, onSearch, onFilterChange }) {
  return (
    <Card className="p-4 shadow-xs">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
        <div className="flex-1">
          <Search
            onSearch={onSearch}
            placeholder="جستجوی نام و نام خانوادگی یا شماره همراه کاربر..."
          />
        </div>
        <div className="border-t md:border-t-0 md:border-r border-border/80 pt-3 md:pt-0 md:pr-4">
          <Filter filterConfig={roleFilterConfig} onFilterChange={onFilterChange} />
        </div>
      </div>
    </Card>
  );
}
