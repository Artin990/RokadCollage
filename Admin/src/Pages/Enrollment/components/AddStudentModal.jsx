import React, { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BadgeIcon from "@mui/icons-material/Badge";
import axiosInstance from "../../../Utils/axiosInstance";
import Loading from "../../../Components/Loading";
import { Button, Badge, Modal } from "../../../Components/UI";
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

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSelectedUser(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const endpoint = query.trim()
          ? `user?q=${encodeURIComponent(query.trim())}&limit=15`
          : `user?limit=15&sort=-_id`;

        const res = await axiosInstance.get(endpoint);
        if (active && res && res.success !== false) {
          const list = Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
            ? res.data
            : Array.isArray(res?.data?.data)
            ? res.data.data
            : [];
          setResults(list);
        }
      } catch (err) {
        // Silently handled by empty results list
      } finally {
        if (active) setLoading(false);
      }
    }, 250);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [query, isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-xl"
      title={
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-light text-primary border border-primary-border flex items-center justify-center shrink-0">
            <PersonAddAlt1Icon fontSize="small" />
          </div>
          <div className="flex flex-col min-w-0">
            <h3 className="font-extrabold text-secondary text-base">
              ثبت‌نام دستی دانش‌آموز در دوره
            </h3>
            <p className="text-xs text-text-muted mt-0.5 truncate">
              {courseTitle} {subtitle ? `• ${subtitle}` : ""}
            </p>
          </div>
        </div>
      }
      footer={
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between w-full gap-3">
          <div className="text-xs text-text-muted text-center sm:text-right">
            {selectedUser ? (
              <span className="text-secondary font-bold">
                ۱ کاربر انتخاب شده است
              </span>
            ) : (
              <span>لطفاً یک کاربر را از لیست بالا انتخاب کنید</span>
            )}
          </div>
          <div className="flex items-center gap-2 justify-end w-full sm:w-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 sm:flex-initial"
            >
              انصراف
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<CheckCircleIcon fontSize="small" />}
              onClick={() => selectedUser && onConfirm(selectedUser)}
              disabled={!selectedUser || isSubmitting}
              loading={isSubmitting}
              className="flex-1 sm:flex-initial"
            >
              تأیید و ثبت‌نام
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Search Input Bar */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-secondary">
              جستجو در میان کاربران:
            </label>
            {results.length > 0 && !loading && (
              <span className="text-text-muted text-[11px]">
                {toPersianDigits(results.length)} کاربر یافت شد
              </span>
            )}
          </div>

          <div className="relative flex items-center">
            <SearchIcon
              style={{ fontSize: "1.15rem" }}
              className="absolute start-3 text-text-muted pointer-events-none"
            />
            <input
              type="text"
              placeholder="جستجو بر اساس نام، شماره موبایل یا کد ملی..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="w-full h-10.5 bg-surface border border-border rounded-xl ps-10 pe-10 text-xs md:text-sm text-secondary placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-2xs"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute end-3 text-text-muted hover:text-secondary p-1 rounded-lg transition-colors cursor-pointer"
                title="پاک کردن جستجو"
              >
                <CloseIcon style={{ fontSize: "1rem" }} />
              </button>
            )}
          </div>
        </div>

        {/* Selected User Highlight Banner */}
        {selectedUser && (
          <div className="p-3.5 rounded-xl border border-primary/50 bg-primary-soft/60 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary text-secondary font-black flex items-center justify-center shrink-0 shadow-xs">
                {selectedUser.fullName
                  ? selectedUser.fullName.charAt(0)
                  : <PersonOutlineIcon fontSize="small" />}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-primary font-bold">
                  دانش‌آموز انتخاب‌شده برای ثبت‌نام:
                </span>
                <span className="text-sm font-black text-secondary truncate mt-0.5">
                  {selectedUser.fullName || "کاربر بدون نام"}
                </span>
                <span className="text-xs text-text-muted flex items-center gap-1 mt-0.5" dir="ltr">
                  <PhoneIphoneIcon style={{ fontSize: "0.85rem" }} />
                  {toPersianDigits(selectedUser.phoneNumber || "")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="success" size="sm">
                آماده ثبت‌نام
              </Badge>
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                className="text-text-muted hover:text-danger p-1 rounded-lg transition-colors cursor-pointer text-xs"
                title="لغو انتخاب"
              >
                <CloseIcon style={{ fontSize: "1.1rem" }} />
              </button>
            </div>
          </div>
        )}

        {/* Users List Container */}
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold text-text-secondary">
            انتخاب کاربر از لیست:
          </span>

          <div className="border border-border/80 rounded-2xl bg-bg-light/30 p-2 max-h-[275px] overflow-y-auto overscroll-contain flex flex-col gap-1.5 custom-scrollbar">
            {loading ? (
              <div className="min-h-[140px] w-full flex flex-col items-center justify-center gap-2.5 select-none py-6">
                <div className="w-10 h-10 rounded-xl bg-primary-soft/80 flex items-center justify-center text-primary shadow-2xs border border-primary-border/60">
                  <Loading size={7} />
                </div>
                <span className="text-xs text-text-muted font-bold">در حال جستجوی کاربران...</span>
              </div>
            ) : results.length === 0 ? (
              <div className="min-h-[140px] w-full text-center flex flex-col items-center justify-center gap-2 text-text-muted select-none py-6">
                <PersonOutlineIcon style={{ fontSize: "2rem" }} className="text-text-muted/60" />
                <span className="text-xs font-medium">
                  {query.trim()
                    ? `کاربری با عبارت «${query}» یافت نشد.`
                    : "هیچ کاربری در سیستم یافت نشد."}
                </span>
                <span className="text-[11px] text-text-muted/80">
                  می‌توانید نام یا شماره موبایل دیگری را جستجو کنید.
                </span>
              </div>
            ) : (
              results.map((u) => {
                const isSelected = selectedUser?._id === u._id;
                const userInitial = u.fullName ? u.fullName.charAt(0) : "؟";

                return (
                  <div
                    key={u._id}
                    onClick={() => setSelectedUser(u)}
                    className={`
                      p-3 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer select-none
                      ${
                        isSelected
                          ? "bg-surface border-primary shadow-xs ring-2 ring-primary/20"
                          : "bg-surface border-border hover:border-primary-border hover:bg-surface/80"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                          isSelected
                            ? "bg-primary text-secondary"
                            : "bg-primary-light text-primary border border-primary-border"
                        }`}
                      >
                        {userInitial}
                      </div>

                      {/* Info */}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs md:text-sm font-bold text-secondary truncate">
                            {u.fullName || "کاربر بدون نام"}
                          </span>
                          {u.role === "admin" && (
                            <Badge variant="amber" size="sm">
                              ادمین
                            </Badge>
                          )}
                          {u.role === "teacher" && (
                            <Badge variant="purple" size="sm">
                              مدرس
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                          <span className="flex items-center gap-1" dir="ltr">
                            <PhoneIphoneIcon style={{ fontSize: "0.8rem" }} />
                            {toPersianDigits(u.phoneNumber || "—")}
                          </span>
                          {u.nationalCode && (
                            <span className="flex items-center gap-1">
                              <BadgeIcon style={{ fontSize: "0.8rem" }} />
                              کدملی: {toPersianDigits(u.nationalCode)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Radio Checkmark */}
                    <div className="shrink-0">
                      {isSelected ? (
                        <CheckCircleIcon className="text-primary" fontSize="small" />
                      ) : (
                        <RadioButtonUncheckedIcon
                          className="text-border-default hover:text-text-muted"
                          fontSize="small"
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}
