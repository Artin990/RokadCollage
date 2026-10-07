import React, { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Card } from "../../../../Components/UI";

export default function SingleCourseSprints({
  sprints,
  title = "سرفصل‌ها و اسپرینت‌های دوره",
  emptyText = "هنوز سرفصلی برای این دوره تعریف نشده است.",
}) {
  // Default all sprints to open
  const [openSprints, setOpenSprints] = useState(() => {
    const initial = {};
    if (Array.isArray(sprints)) {
      sprints.forEach((_, idx) => {
        initial[idx] = true;
      });
    }
    return initial;
  });

  const toggleSprint = (index) => {
    setOpenSprints((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const sprintList = sprints || [];

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 rounded-full bg-primary" />
          <h3 className="text-lg md:text-xl font-bold text-secondary">
            {title}
          </h3>
        </div>
        {sprintList.length > 0 && (
          <span className="text-xs font-bold text-text-muted bg-surface px-3 py-1 rounded-xl border border-border">
            {sprintList.length} اسپرینت
          </span>
        )}
      </div>

      {sprintList.length > 0 ? (
        <div className="flex flex-col gap-3.5">
          {sprintList.map((sprint, index) => {
            const isOpen = openSprints[index] !== false;
            return (
              <Card
                key={index}
                className="p-0 border border-border overflow-hidden shadow-2xs transition-all hover:border-primary-border"
              >
                {/* Sprint Header / Accordion trigger */}
                <button
                  type="button"
                  onClick={() => toggleSprint(index)}
                  className="w-full p-4 md:p-5 flex items-center justify-between gap-4 text-right cursor-pointer bg-surface hover:bg-surface-hover/70 transition-colors select-none"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-primary-light border border-primary-border text-primary font-black text-sm flex items-center justify-center shrink-0">
                      {index + 1}
                    </div>
                    <h4 className="font-bold text-secondary text-sm md:text-base truncate">
                      {sprint.title}
                    </h4>
                  </div>

                  <div className="text-text-muted shrink-0">
                    {isOpen ? (
                      <KeyboardArrowUpIcon fontSize="small" />
                    ) : (
                      <KeyboardArrowDownIcon fontSize="small" />
                    )}
                  </div>
                </button>

                {/* Sprint Description Body */}
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-border/40 text-text-secondary text-xs md:text-sm leading-relaxed whitespace-pre-line bg-bg-light/30">
                    {sprint.description}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center text-text-muted text-sm border-dashed">
          {emptyText}
        </Card>
      )}
    </section>
  );
}
