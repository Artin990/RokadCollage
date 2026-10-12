import React from "react";
import { Card } from "../../../Components/UI";
import { getImageUrl } from "../../../Utils/getImageUrl";

export default function SingleCourseTeachers({ teachers }) {
  const teacherList = teachers || [];
  if (teacherList.length === 0) return null;

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 rounded-full bg-primary" />
          <h3 className="text-lg md:text-xl font-bold text-secondary">
            اساتید و مربیان این دوره
          </h3>
        </div>
        <span className="text-xs font-bold text-text-muted bg-surface px-3 py-1 rounded-xl border border-border">
          {teacherList.length} استاد
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {teacherList.map((teacher, index) => {
          const isObj = typeof teacher === "object" && teacher !== null;
          const name = isObj ? teacher.name : "استاد دوره";
          const specialization = isObj ? teacher.specialization : "";
          const photo = isObj ? teacher.photo : null;

          return (
            <Card
              key={isObj ? teacher._id || index : index}
              className="p-4 border border-border flex items-center gap-3.5 shadow-2xs hover:border-primary-border transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-light border border-primary-border overflow-hidden shrink-0 flex items-center justify-center text-primary font-bold">
                {photo ? (
                  <img
                    src={getImageUrl(photo)}
                    alt={name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span>{name.charAt(0)}</span>
                )}
              </div>

              <div className="flex flex-col gap-0.5 overflow-hidden">
                <h4 className="font-bold text-secondary text-sm truncate">
                  {name}
                </h4>
                {specialization && (
                  <p className="text-xs text-text-muted truncate">
                    {specialization}
                  </p>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
