import React from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { Card } from "../../../../Components/UI";
import { getImageUrl } from "../../../../Utils/getImageUrl";

export default function SingleCourseTeachers({ teachers }) {
  const teacherList = teachers || [];

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 rounded-full bg-primary" />
          <h3 className="text-lg md:text-xl font-bold text-secondary">
            اساتید و معلمان دوره
          </h3>
        </div>
        {teacherList.length > 0 && (
          <span className="text-xs font-bold text-text-muted bg-surface px-3 py-1 rounded-xl border border-border">
            {teacherList.length} استاد
          </span>
        )}
      </div>

      {teacherList.length > 0 ? (
        <div
          className={`grid gap-4 ${
            teacherList.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {teacherList.map((teacher, index) => {
            const teacherPhoto = teacher?.photo ? getImageUrl(teacher.photo) : null;
            return (
              <Card
                key={teacher?._id || index}
                className="p-5 md:p-6 border border-border shadow-xs hover:border-primary-border transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Teacher Photo / Avatar */}
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-primary-light border-2 border-primary-border shrink-0 flex items-center justify-center text-primary shadow-xs">
                    {teacherPhoto ? (
                      <img
                        src={teacherPhoto}
                        alt={teacher.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <PersonOutlineIcon style={{ fontSize: "2rem" }} />
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 min-w-0 flex-1">
                    <h4 className="text-base md:text-lg font-bold text-secondary truncate">
                      {teacher?.name || "نام استاد"}
                    </h4>
                    <div className="bg-bg-light/80 rounded-xl px-3 py-1.5 border border-border/70 text-xs md:text-sm text-text-secondary leading-relaxed">
                      <span className="font-semibold text-text-muted text-[11px] block mb-0.5">
                        تخصص و حوزه تدریس:
                      </span>
                      <span>{teacher?.specialization || "تخصص ثبت نشده"}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-8 text-center text-text-muted text-sm border-dashed">
          هنوز استادی به این دوره متصل نشده است.
        </Card>
      )}
    </section>
  );
}
