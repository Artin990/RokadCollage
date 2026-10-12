import React from "react";
import { Card } from "../../../Components/UI";

export default function SingleCourseAbout({ description }) {
  if (!description) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5 px-1">
        <span className="w-2.5 h-6 rounded-full bg-primary" />
        <h3 className="text-lg md:text-xl font-bold text-secondary">
          درباره‌ی این کارگاه
        </h3>
      </div>

      <Card className="p-6 md:p-8 border border-border shadow-xs">
        <p className="text-text-secondary text-sm md:text-base leading-loose whitespace-pre-line text-justify">
          {description}
        </p>
      </Card>
    </section>
  );
}
