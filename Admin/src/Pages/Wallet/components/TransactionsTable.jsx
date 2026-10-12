import React from "react";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
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

const getStatusBadge = (status) => {
  switch (status) {
    case "success":
      return <Badge variant="success" size="sm">موفق</Badge>;
    case "failed":
      return <Badge variant="danger" size="sm">ناموفق</Badge>;
    default:
      return <Badge variant="warning" size="sm">در انتظار</Badge>;
  }
};

const extractTxUser = (tx, usersMap = {}) => {
  if (tx.userId && typeof tx.userId === "object") return tx.userId;
  if (tx.user && typeof tx.user === "object") return tx.user;
  if (tx.ownerId && typeof tx.ownerId === "object") return tx.ownerId;

  const rawId = tx.userId || tx.user || tx.ownerId;
  if (rawId && usersMap[String(rawId)]) {
    return usersMap[String(rawId)];
  }
  return null;
};

export default function TransactionsTable({ transactions = [], usersMap = {}, onSelectUser }) {
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={<ReceiptLongOutlinedIcon style={{ fontSize: "2rem" }} />}
        title="هیچ تراکنشی یافت نشد"
        description="تاکنون هیچ تراکنش مالی در سامانه ثبت نشده است."
      />
    );
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow isHeader hover={false}>
            <TableHeadCell align="center" className="w-12">#</TableHeadCell>
            <TableHeadCell>کاربر</TableHeadCell>
            <TableHeadCell>شماره تماس</TableHeadCell>
            <TableHeadCell>مبلغ تراکنش</TableHeadCell>
            <TableHeadCell>نوع / شرح</TableHeadCell>
            <TableHeadCell align="center">وضعیت</TableHeadCell>
            <TableHeadCell>تاریخ و ساعت</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((tx, index) => {
            const user = extractTxUser(tx, usersMap);
            const userName = user?.fullName?.trim() || user?.name?.trim() || "کاربر سیستم";
            const userPhone = user?.phoneNumber || user?.phone || "-";
            const amount = tx.amount || 0;

            return (
              <TableRow key={tx._id || index}>
                <TableCell align="center" className="text-text-muted font-medium text-xs">
                  {toPersianDigits(index + 1)}
                </TableCell>
                <TableCell>
                  <div
                    onClick={() => user && onSelectUser?.(user)}
                    className={`flex items-center gap-2.5 select-none ${user ? "cursor-pointer group/user" : ""}`}
                    title={user ? "مشاهده پروفایل و جزئیات کاربر" : undefined}
                  >
                    <div className="w-7 h-7 rounded-full bg-secondary-light border border-secondary-muted flex items-center justify-center text-secondary font-bold text-xs shrink-0 group-hover/user:bg-primary group-hover/user:text-secondary transition-all">
                      {userName && userName !== "کاربر سیستم" ? userName[0] : <PersonOutlineIcon fontSize="inherit" />}
                    </div>
                    <span className={`font-bold text-secondary transition-colors ${user ? "group-hover/user:text-primary group-hover/user:underline underline-offset-4" : ""}`}>
                      {userName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary font-mono text-xs">
                  <span dir="ltr">{userPhone !== "-" ? toPersianDigits(userPhone) : "-"}</span>
                </TableCell>
                <TableCell className="font-black">
                  <span className="text-secondary">
                    {toPersianDigits(amount.toLocaleString("fa-IR"))} تومان
                  </span>
                </TableCell>
                <TableCell className="text-text-secondary">
                  {tx.description || (tx.type === "deposit" ? "شارژ حساب" : tx.type === "withdraw" ? "برداشت از حساب" : tx.type || "تراکنش مالی")}
                </TableCell>
                <TableCell align="center">
                  {getStatusBadge(tx.status)}
                </TableCell>
                <TableCell className="text-text-muted text-xs">
                  {tx.createdAt ? formatJalaliDate(tx.createdAt, { withTime: true }) : "-"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
