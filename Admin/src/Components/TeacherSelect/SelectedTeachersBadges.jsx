import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import { getImageUrl } from "../../Utils/getImageUrl";

export default function SelectedTeachersBadges({ selectedDetails = [], onRemove }) {
  if (selectedDetails.length === 0) {
    return (
      <span className="text-xs text-text-muted self-center">
        معلمی برای این دوره انتخاب نشده است. از باکس زیر جستجو و اضافه کنید.
      </span>
    );
  }

  return (
    <>
      {selectedDetails.map((teacher) => {
        const photoUrl = getImageUrl(teacher.photo);
        return (
          <div
            key={teacher._id}
            className="inline-flex items-center gap-2.5 bg-surface text-secondary ps-2.5 pe-2 py-1.5 rounded-xl border border-border shadow-2xs group"
          >
            <div className="w-7 h-7 rounded-full overflow-hidden bg-primary-light border border-primary-border shrink-0 flex items-center justify-center text-primary">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={teacher.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <PersonIcon style={{ fontSize: "1rem" }} />
              )}
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-xs font-bold text-secondary">
                {teacher.name}
              </span>
              <span className="text-[10px] text-text-muted">
                {teacher.specialization}
              </span>
            </div>

            <button
              type="button"
              onClick={() => onRemove(teacher._id)}
              className="ms-1 text-text-muted hover:text-error transition-colors p-1 rounded-lg hover:bg-bg-light cursor-pointer"
              title="حذف معلم از این دوره"
              aria-label="حذف معلم از این دوره"
            >
              <CloseIcon style={{ fontSize: "1rem" }} />
            </button>
          </div>
        );
      })}
    </>
  );
}
