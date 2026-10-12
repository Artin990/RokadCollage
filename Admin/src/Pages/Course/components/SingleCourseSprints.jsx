import React from "react";
import { Card } from "../../../Components/UI";

export default function SingleCourseSprints({ sprints }) {
  const sprintList = sprints || [];
  if (sprintList.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 rounded-full bg-primary" />
          <h3 className="text-lg md:text-xl font-bold text-secondary">
            سرفصل‌ها و مباحث آموزشی دوره
          </h3>
        </div>
        <span className="text-xs font-bold text-text-muted bg-surface px-3 py-1 rounded-xl border border-border">
          {sprintList.length} اسپرینت
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {sprintList.map((sprint, index) => (
          <Card
            key={sprint._id || index}
            className="p-5 border border-border hover:border-primary-border transition-colors flex flex-col gap-2.5 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-lg bg-primary-light border border-primary-border text-primary font-black text-xs flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <h4 className="font-bold text-secondary text-sm md:text-base">
                {sprint.title}
              </h4>
            </div>

            <p className="text-xs md:text-sm text-text-muted leading-relaxed pe-2 whitespace-pre-line">
              {sprint.description}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
