import React from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { Badge } from "../../../Components/UI";
import { formatJalaliDate, toPersianDigits } from "../../../Utils/jalaliDate";

const getRoleBadge = (role) => {
  switch (role) {
    case "superAdmin":
      return <Badge variant="warning" size="sm">مدیر ارشد</Badge>;
    case "admin":
      return <Badge variant="primary" size="sm">مدیر</Badge>;
    default:
      return <Badge variant="neutral" size="sm">دانش‌آموز</Badge>;
  }
};

export default function UserTable({
  users = [],
  loading = false,
  onSelectProfile,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border/80 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-right border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-bg-subtle/80 text-text-secondary border-b border-border/70 font-bold">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4">نام و مشخصات کاربر</th>
              <th className="py-3.5 px-4">شماره همراه</th>
              <th className="py-3.5 px-4">سطح دسترسی / نقش</th>
              <th className="py-3.5 px-4">تاریخ تولد</th>
              <th className="py-3.5 px-4">تاریخ عضویت</th>
              <th className="py-3.5 px-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50 text-text-primary">
            {users.map((user, index) => (
              <tr
                key={user._id || index}
                className="hover:bg-bg-subtle/40 transition-colors group"
              >
                <td className="py-3.5 px-4 text-center text-text-muted font-medium text-xs">
                  {toPersianDigits(index + 1)}
                </td>
                <td className="py-3.5 px-4">
                  <div
                    onClick={() => onSelectProfile(user)}
                    className="flex items-center gap-3 cursor-pointer group-hover:text-primary transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-light border border-primary-border flex items-center justify-center text-primary font-bold text-xs shrink-0">
                      {user.fullName?.trim() ? user.fullName.trim()[0] : "ک"}
                    </div>
                    <span className="font-bold">
                      {user.fullName || "کاربر بدون نام"}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 px-4 font-mono text-secondary font-medium" dir="ltr">
                  {user.phoneNumber ? toPersianDigits(user.phoneNumber) : "—"}
                </td>
                <td className="py-3.5 px-4">
                  {getRoleBadge(user.role)}
                </td>
                <td className="py-3.5 px-4 text-text-secondary text-xs">
                  {user.birthDate ? toPersianDigits(user.birthDate) : "—"}
                </td>
                <td className="py-3.5 px-4 text-text-secondary text-xs">
                  {formatJalaliDate(user.createdAt, { withTime: true })}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onSelectProfile(user)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary-light transition-colors cursor-pointer"
                      title="مشاهده پروفایل و سوابق"
                    >
                      <VisibilityOutlinedIcon style={{ fontSize: "1.15rem" }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-secondary hover:bg-bg-light transition-colors cursor-pointer"
                      title="ویرایش اطلاعات"
                    >
                      <EditOutlinedIcon style={{ fontSize: "1.15rem" }} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-error hover:bg-error-light transition-colors cursor-pointer"
                      title="حذف کاربر"
                    >
                      <DeleteOutlineIcon style={{ fontSize: "1.15rem" }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-16 px-4 text-text-muted text-xs md:text-sm flex flex-col items-center gap-2">
          <PersonOutlineIcon style={{ fontSize: "2.5rem" }} className="text-text-muted/50" />
          <span>کاربری با این مشخصات یافت نشد.</span>
        </div>
      )}
    </div>
  );
}
