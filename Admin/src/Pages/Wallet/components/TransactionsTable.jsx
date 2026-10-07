import React from "react";
import { Card, Badge } from "../../../Components/UI";
import { formatJalaliDate } from "../../../Utils/jalaliDate";

export default function TransactionsTable({ transactions = [] }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "success":
        return <Badge variant="success" size="sm">موفق</Badge>;
      case "failed":
        return <Badge variant="error" size="sm">ناموفق</Badge>;
      default:
        return <Badge variant="amber" size="sm">در انتظار</Badge>;
    }
  };

  return (
    <Card className="overflow-x-auto p-4 shadow-xs">
      <table className="w-full text-right text-xs md:text-sm">
        <thead>
          <tr className="border-b border-border text-text-muted font-semibold">
            <th className="p-3">کاربر</th>
            <th className="p-3">مبلغ</th>
            <th className="p-3">نوع / شرح</th>
            <th className="p-3">وضعیت</th>
            <th className="p-3">تاریخ</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr key={tx._id} className="border-b border-border/60 hover:bg-surface-hover/50">
              <td className="p-3 font-medium text-secondary">{tx.user?.fullName || tx.user?.phoneNumber || "کاربر"}</td>
              <td className="p-3 font-bold text-secondary">
                {(tx.amount || 0).toLocaleString("fa-IR")} تومان
              </td>
              <td className="p-3 text-text-secondary">{tx.description || tx.type || "تراکنش مالی"}</td>
              <td className="p-3">{getStatusBadge(tx.status)}</td>
              <td className="p-3 text-text-muted text-xs">
                {tx.createdAt ? formatJalaliDate(tx.createdAt, { withTime: true }) : "-"}
              </td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-8 text-text-muted">
                هیچ تراکنشی ثبت نشده است.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}
