import React from "react";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Badge,
  IconButton,
  TableSkeleton,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeadCell,
  TableCell,
  TableBody,
} from "../../../Components/UI";
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
  if (loading && (!users || users.length === 0)) {
    return <TableSkeleton rows={8} cols={7} />;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow isHeader hover={false}>
            <TableHeadCell align="center" className="w-12">#</TableHeadCell>
            <TableHeadCell>نام و مشخصات کاربر</TableHeadCell>
            <TableHeadCell>شماره همراه</TableHeadCell>
            <TableHeadCell>سطح دسترسی / نقش</TableHeadCell>
            <TableHeadCell>تاریخ تولد</TableHeadCell>
            <TableHeadCell>تاریخ عضویت</TableHeadCell>
            <TableHeadCell align="center">عملیات</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow key={user._id || index}>
              <TableCell align="center" className="text-text-muted font-medium text-xs">
                {toPersianDigits(index + 1)}
              </TableCell>
              <TableCell>
                <div
                  onClick={() => onSelectProfile(user)}
                  className="flex items-center gap-3 cursor-pointer group-hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-light border border-primary-border flex items-center justify-center text-primary font-bold text-xs shrink-0 group-hover:bg-primary group-hover:text-secondary transition-colors">
                    {user.fullName?.trim() ? user.fullName.trim()[0] : "ک"}
                  </div>
                  <span className="font-bold">
                    {user.fullName || "کاربر بدون نام"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="font-mono text-secondary font-medium text-xs">
                <span dir="ltr">{user.phoneNumber ? toPersianDigits(user.phoneNumber) : "—"}</span>
              </TableCell>
              <TableCell>
                {getRoleBadge(user.role)}
              </TableCell>
              <TableCell className="text-text-secondary text-xs">
                {user.birthDate ? toPersianDigits(user.birthDate) : "—"}
              </TableCell>
              <TableCell className="text-text-secondary text-xs">
                {formatJalaliDate(user.createdAt, { withTime: true })}
              </TableCell>
              <TableCell align="center">
                <div className="flex items-center justify-center gap-1.5">
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon={<VisibilityOutlinedIcon fontSize="small" />}
                    onClick={() => onSelectProfile(user)}
                    title="مشاهده پروفایل"
                    aria-label="مشاهده پروفایل"
                  />
                  <IconButton
                    variant="ghost"
                    size="sm"
                    icon={<EditOutlinedIcon fontSize="small" />}
                    onClick={() => onEdit(user)}
                    title="ویرایش کاربر"
                    aria-label="ویرایش کاربر"
                  />
                  <IconButton
                    variant="danger"
                    size="sm"
                    icon={<DeleteOutlineIcon fontSize="small" />}
                    onClick={() => onDelete(user)}
                    title="حذف کاربر"
                    aria-label="حذف کاربر"
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {users.length === 0 && !loading && (
        <div className="text-center py-16 px-4 text-text-muted text-xs md:text-sm flex flex-col items-center gap-2">
          <PersonOutlineIcon style={{ fontSize: "2.5rem" }} className="text-text-muted/50" />
          <span>کاربری با این مشخصات یافت نشد.</span>
        </div>
      )}
    </TableContainer>
  );
}
