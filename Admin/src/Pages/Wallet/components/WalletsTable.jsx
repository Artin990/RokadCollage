import React from "react";
import { Card } from "../../../Components/UI";

export default function WalletsTable({ wallets = [] }) {
  return (
    <Card className="overflow-x-auto p-4 shadow-xs">
      <table className="w-full text-right text-xs md:text-sm">
        <thead>
          <tr className="border-b border-border text-text-muted font-semibold">
            <th className="p-3">کاربر</th>
            <th className="p-3">شماره تماس</th>
            <th className="p-3">موجودی کیف پول</th>
          </tr>
        </thead>
        <tbody>
          {wallets.map((w) => (
            <tr key={w._id} className="border-b border-border/60 hover:bg-surface-hover/50">
              <td className="p-3 font-medium text-secondary">{w.user?.fullName || w.user?.name || "کاربر سیستم"}</td>
              <td className="p-3 text-text-secondary">{w.user?.phoneNumber || "-"}</td>
              <td className="p-3 font-bold text-primary">
                {(w.balance || 0).toLocaleString("fa-IR")} تومان
              </td>
            </tr>
          ))}
          {wallets.length === 0 && (
            <tr>
              <td colSpan={3} className="text-center py-8 text-text-muted">
                هیچ کیف پولی ثبت نشده است.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </Card>
  );
}
