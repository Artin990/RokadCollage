import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";
import { getImageUrl } from "../../Utils/getImageUrl";

export default function TeacherDropdown({
  isOpen,
  results = [],
  selectedIds = [],
  query = "",
  onSelect,
}) {
  if (!isOpen) return null;

  return (
    <div className="absolute z-50 mt-1.5 w-full bg-surface border border-border rounded-2xl shadow-lg max-h-64 overflow-y-auto overscroll-contain p-1.5 animate-fadeIn custom-scrollbar">
      {results.length > 0 ? (
        results.map((teacher) => {
          const isSelected = selectedIds.includes(teacher._id);
          const photoUrl = getImageUrl(teacher.photo);

          return (
            <div
              key={teacher._id}
              onClick={() => onSelect(teacher)}
              className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all duration-150 select-none ${
                isSelected
                  ? "bg-primary-light/80 border border-primary-border text-secondary"
                  : "hover:bg-surface-hover text-text-primary"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full overflow-hidden bg-bg-light border border-border/70 shrink-0 flex items-center justify-center text-primary">
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <PersonIcon fontSize="small" />
                  )}
                </div>

                <div className="flex flex-col">
                  <span className="text-xs md:text-sm font-bold">
                    {teacher.name}
                  </span>
                  <span className="text-[11px] text-text-muted">
                    {teacher.specialization}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                {isSelected ? (
                  <div className="w-6 h-6 rounded-lg bg-primary text-secondary flex items-center justify-center shadow-xs">
                    <CheckIcon style={{ fontSize: "1rem" }} />
                  </div>
                ) : (
                  <span className="text-[11px] font-semibold text-text-muted hover:text-primary">
                    + افزودن
                  </span>
                )}
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-4 text-center text-xs text-text-muted">
          {query ? "معلمی با این مشخصات یافت نشد." : "معلمی یافت نشد."}
        </div>
      )}
    </div>
  );
}
