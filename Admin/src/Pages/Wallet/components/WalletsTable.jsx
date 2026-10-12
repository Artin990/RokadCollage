import React from "react";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  Card,
  Badge,
  EmptyState,
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

const extractUser = (wallet, usersMap = {}) => {
  if (wallet.ownerId && typeof wallet.ownerId === "object") return wallet.ownerId;
  if (wallet.userId && typeof wallet.userId === "object") return wallet.userId;
  if (wallet.user && typeof wallet.user === "object") return wallet.user;
  if (wallet.owner && typeof wallet.owner === "object") return wallet.owner;

  const rawId = wallet.ownerId || wallet.userId || wallet.user || wallet.owner;
  if (rawId && usersMap[String(rawId)]) {
    return usersMap[String(rawId)];
  }
  return null;
};

export default function WalletsTable({ wallets = [], usersMap = {}, onSelectUser }) {
  if (!wallets || wallets.length === 0) {
    return (
      <EmptyState
        icon={<AccountBalanceWalletOutlinedIcon style={{ fontSize: "2rem" }} />}
        title="هیچ کیف‌پولی یافت نشد"
        description="در حال حاضر هیچ حسابی برای نمایش موجودی در سیستم ثبت نشده است."
      />
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow isHeader hover={false}>
            <TableHeadCell align="center" className="w-12">#</TableHeadCell>
            <TableHeadCell>کاربر و صاحب حساب</TableHeadCell>
            <TableHeadCell>شماره تماس</TableHeadCell>
            <TableHeadCell>سطح کاربری</TableHeadCell>
            <TableHeadCell>موجودی کیف پول</TableHeadCell>
            <TableHeadCell>آخرین به‌روزرسانی</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wallets.map((w, index) => {
            const user = extractUser(w, usersMap);
            const userName = user?.fullName?.trim() || user?.name?.trim() || "کاربر سیستم";
            const userPhone = user?.phoneNumber || user?.phone || "-";
            const userRole = user?.role || "user";
            const balance = w.balance || 0;

            return (
              <TableRow key={w._id || index}>
                <TableCell align="center" className="text-text-muted font-medium text-xs">
                  {toPersianDigits(index + 1)}
                </TableCell>
                <TableCell>
                  <div
                    onClick={() => user && onSelectUser?.(user)}
                    className={`flex items-center gap-3 select-none ${user ? "cursor-pointer group/user" : ""}`}
                    title={user ? "مشاهده پروفایل و جزئیات کاربر" : undefined}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-light border border-primary-border flex items-center justify-center text-primary font-bold text-xs shrink-0 group-hover/user:bg-primary group-hover/user:text-secondary transition-all">
                      {userName && userName !== "کاربر سیستم" ? userName[0] : <PersonOutlineIcon fontSize="small" />}
                    </div>
                    <div className="flex flex-col">
                      <span className={`font-bold text-secondary transition-colors ${user ? "group-hover/user:text-primary group-hover/user:underline underline-offset-4" : ""}`}>
                        {userName}
                      </span>
                      {user?._id && (
                        <span className="text-2xs text-text-muted font-mono" dir="ltr">
                          #{String(user._id).slice(-6)}
                        </span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary font-mono text-xs">
                  <span dir="ltr">{userPhone !== "-" ? toPersianDigits(userPhone) : "-"}</span>
                </TableCell>
                <TableCell>
                  {getRoleBadge(userRole)}
                </TableCell>
                <TableCell className="font-black text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-1 rounded-xl font-bold ${
                      balance > 0
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-bg-subtle text-text-secondary border border-border"
                    }`}
                  >
                    {toPersianDigits(balance.toLocaleString("fa-IR"))} تومان
                  </span>
                </TableCell>
                <TableCell className="text-text-muted text-xs">
                  {w.updatedAt || w.createdAt
                    ? formatJalaliDate(w.updatedAt || w.createdAt, { withTime: true })
                    : "ثبت اولیه"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
