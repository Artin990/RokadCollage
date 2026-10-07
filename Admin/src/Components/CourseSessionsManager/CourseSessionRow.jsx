import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Button, Input } from "../UI";
import { toPersianDigits } from "../../Utils/jalaliDate";

export default function CourseSessionRow({
  session,
  index,
  mode,
  canDelete,
  onFieldChange,
  onDelete,
  onSave,
  isSaving,
  fieldErrors = {},
}) {
  const sessionKey = session._id || session.tempId || index;
  const isUpdate = mode === "update";
  const isPersisted = isUpdate && !session.isNew;

  return (
    <div className="bg-surface rounded-xl border border-border/80 p-4 shadow-2xs flex flex-col gap-3">
      {/* Top Header of row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="font-bold text-xs md:text-sm text-secondary">
            {session.code || `کد کلاس ${index + 1}`}
          </span>
          {isPersisted && (
            <span className="text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-md font-medium">
              ثبت‌شده
            </span>
          )}
          {isPersisted && session.enrolledCount !== undefined && (
            <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-md font-medium">
              ثبت‌نامی: {toPersianDigits(session.enrolledCount)} نفر
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isUpdate && (
            <Button
              type="button"
              variant={isPersisted ? "outline" : "primary"}
              size="xs"
              icon={isPersisted ? <CheckCircleOutlineIcon fontSize="inherit" /> : <SaveOutlinedIcon fontSize="inherit" />}
              onClick={() => onSave(session)}
              isLoading={isSaving}
              disabled={isSaving}
            >
              {isPersisted ? "بروزرسانی کد" : "ذخیره در سرور"}
            </Button>
          )}

          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(isUpdate ? session : index)}
              title="حذف کد کلاس"
              className="p-1 rounded-lg text-text-muted hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
            >
              <DeleteOutlineIcon fontSize="small" />
            </button>
          )}
        </div>
      </div>

      {/* Inputs grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <Input
          label="عنوان کد کلاس"
          placeholder="مثال: کد ۱ یا شنبه و دوشنبه"
          value={session.code || ""}
          onChange={(e) => onFieldChange(sessionKey, "code", e.target.value)}
          error={fieldErrors.code}
        />

        <Input
          label="روزهای برگزاری"
          placeholder="مثال: شنبه و چهارشنبه"
          value={session.scheduleDays || ""}
          onChange={(e) => onFieldChange(sessionKey, "scheduleDays", e.target.value)}
          error={fieldErrors.scheduleDays}
        />

        <Input
          label="ساعت برگزاری"
          placeholder="مثال: ۱۷:۰۰ الی ۲۰:۰۰"
          value={session.scheduleHours || ""}
          onChange={(e) => onFieldChange(sessionKey, "scheduleHours", e.target.value)}
          error={fieldErrors.scheduleHours}
        />

        <Input
          label="ظرفیت (نفر)"
          type="number"
          min="1"
          placeholder="مثال: ۱۵"
          value={session.capacity !== undefined ? session.capacity : ""}
          onChange={(e) => onFieldChange(sessionKey, "capacity", e.target.value)}
          error={fieldErrors.capacity}
        />
      </div>
    </div>
  );
}
