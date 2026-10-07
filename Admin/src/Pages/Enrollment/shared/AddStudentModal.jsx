import React, { useState, useEffect, useRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import axiosInstance from "../../../Utils/axiosInstance";
import Loading from "../../../Components/Loading";
import { Button, Badge } from "../../../Components/UI";
import { toPersianDigits } from "../../../Utils/jalaliDate";

export default function AddStudentModal({
  isOpen,
  onClose,
  courseTitle,
  subtitle,
  onConfirm,
  isSubmitting = false,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);
  const searchBoxRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedUser(null);
      setIsOpenDropdown(false);
      return;
    }

    let active = true;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const endpoint = query.trim()
          ? `user?q=${encodeURIComponent(query.trim())}&limit=10`
          : `user?limit=10&sort=-_id`;

        const res = await axiosInstance.get(endpoint);
        if (active && res && res.success !== false) {
          const list = Array.isArray(res) ? res : res.data || [];
          setResults(list);
        }
      } catch (err) {
        console.error("Error searching users:", err);
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto"
    >
      <div className="bg-surface rounded-2xl border border-border shadow-xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/80 bg-bg-light/40">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              <PersonAddAlt1Icon fontSize="small" />
            </div>
            <div>
              <h3 className="font-bold text-secondary text-base">ثبت‌نام دستی دانش‌آموز</h3>
              <p className="text-xs text-text-muted mt-0.5">
                {courseTitle} {subtitle ? `• ${subtitle}` : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-text-muted hover:text-secondary p-1.5 rounded-lg hover:bg-border/40 transition-colors"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-5">
          <div className="relative" ref={searchBoxRef}>
            <label className="block text-xs font-bold text-secondary mb-1.5">
              جستجو و انتخاب کاربر
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="جستجو با نام، شماره موبایل یا کدملی..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsOpenDropdown(true);
                }}
                onFocus={() => setIsOpenDropdown(true)}
                className="w-full bg-white border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-secondary placeholder:text-text-muted focus:outline-hidden focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <SearchIcon
                fontSize="small"
                className="absolute right-3 text-text-muted pointer-events-none"
              />
            </div>

            {/* Results Dropdown */}
            {isOpenDropdown && (
              <div className="absolute top-full mt-1.5 w-full bg-surface border border-border rounded-xl shadow-lg z-50 max-h-56 overflow-y-auto divide-y divide-border/60">
                {loading ? (
                  <div className="p-4 flex justify-center">
                    <Loading size={6} />
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-4 text-center text-xs text-text-muted">
                    کاربری با این مشخصات یافت نشد
                  </div>
                ) : (
                  results.map((u) => {
                    const isSelected = selectedUser?._id === u._id;
                    return (
                      <div
                        key={u._id}
                        onClick={() => {
                          setSelectedUser(u);
                          setIsOpenDropdown(false);
                        }}
                        className={`p-3 flex items-center justify-between cursor-pointer transition-colors ${
                          isSelected ? "bg-primary-light" : "hover:bg-bg-light/60"
                        }`}
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-secondary truncate">
                            {u.fullName || "بدون نام"}
                          </span>
                          <span className="text-xs text-text-muted flex items-center gap-1 font-mono">
                            <PhoneIphoneIcon style={{ fontSize: "0.85rem" }} />
                            {toPersianDigits(u.phoneNumber || "-")}
                          </span>
                        </div>
                        {isSelected && (
                          <CheckCircleIcon fontSize="small" className="text-primary shrink-0" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* Selected user card */}
          {selectedUser && (
            <div className="p-4 rounded-xl border border-primary/40 bg-primary-light/40 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs text-primary font-bold">کاربر انتخاب‌شده:</span>
                <span className="text-sm font-black text-secondary mt-0.5">
                  {selectedUser.fullName}
                </span>
                <span className="text-xs text-text-muted font-mono mt-0.5">
                  {toPersianDigits(selectedUser.phoneNumber || "")}
                </span>
              </div>
              <Badge variant="primary" size="sm">
                آماده ثبت‌نام
              </Badge>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border/80 flex items-center justify-end gap-3 bg-bg-light/20">
          <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
            انصراف
          </Button>
          <Button
            variant="primary"
            onClick={() => selectedUser && onConfirm(selectedUser)}
            disabled={!selectedUser || isSubmitting}
            isLoading={isSubmitting}
          >
            تأیید و ثبت‌نام دانش‌آموز
          </Button>
        </div>
      </div>
    </div>
  );
}
