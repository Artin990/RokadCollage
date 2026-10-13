"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, Lock, Calendar, CheckCircle2, AlertCircle, Save, RotateCw } from "lucide-react";
import { getMyProfile, updateMyProfile } from "@/services/userService";
import { getPanelStore, updateProfile } from "@/data/panelStore";

export default function UserProfileSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    birthDate: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const res = await getMyProfile();
        const profile = res?.data || res;
        if (profile) {
          setFormData((prev) => ({
            ...prev,
            fullName: profile.fullName || "",
            phoneNumber: profile.phoneNumber || "",
            birthDate: profile.birthDate || "",
          }));
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        // Fallback to local store
        const store = getPanelStore();
        if (store?.user) {
          setFormData((prev) => ({
            ...prev,
            fullName: store.user.fullName || "",
            phoneNumber: store.auth?.userPhone || store.user.phone || "",
          }));
        }
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (formData.newPassword && formData.newPassword.length < 6) {
      setErrorMsg("رمز عبور جدید باید حداقل ۶ کاراکتر باشد");
      return;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setErrorMsg("رمز عبور جدید با تکرار آن یکسان نیست");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        fullName: formData.fullName.trim(),
        birthDate: formData.birthDate.trim(),
      };

      if (formData.newPassword) {
        payload.password = formData.newPassword;
      }

      const res = await updateMyProfile(payload);
      const updated = res?.data || res;

      // Sync local panelStore so header updates immediately
      updateProfile({
        fullName: updated.fullName || formData.fullName,
        firstName: (updated.fullName || formData.fullName).split(" ")[0] || "کاربر",
        initial: (updated.fullName || formData.fullName)[0] || "پ",
      });

      setSuccessMsg("تغییرات با موفقیت ذخیره شد");
      setFormData((prev) => ({
        ...prev,
        newPassword: "",
        confirmPassword: "",
      }));
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      setErrorMsg(err?.message || "خطا در ذخیره اطلاعات");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-stone-500 font-bold">
        <RotateCw className="w-7 h-7 animate-spin text-[#f8a41d]" />
        <span>در حال بارگذاری اطلاعات حساب...</span>
      </div>
    );
  }

  const initialLetter = formData.fullName ? formData.fullName.trim()[0] : "پ";

  return (
    <div className="bg-white border-2 border-stone-900 rounded-[20px_0_20px_0] shadow-[5px_5px_0_#292827] p-6 sm:p-8 max-w-2xl mx-auto">
      {/* سربرگ آواتار کاربر */}
      <div className="flex items-center gap-4 pb-6 mb-6 border-b-2 border-stone-100">
        <div className="w-16 h-16 rounded-[14px_0_14px_0] bg-[#f8a41d] text-stone-950 border-2 border-stone-900 shadow-[3px_3px_0_#292827] flex items-center justify-center text-2xl font-black">
          {initialLetter}
        </div>
        <div>
          <h2 className="text-xl font-black text-stone-900">
            {formData.fullName || "حساب کاربری"}
          </h2>
          <span className="text-xs font-bold text-stone-500 font-mono mt-0.5 block" dir="ltr">
            {formData.phoneNumber}
          </span>
        </div>
      </div>

      {/* پیام بازخورد */}
      {successMsg && (
        <div className="mb-5 bg-emerald-50 border-2 border-emerald-800 text-emerald-900 rounded-[10px_0_10px_0] p-3 text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-700" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mb-5 bg-rose-50 border-2 border-rose-800 text-rose-900 rounded-[10px_0_10px_0] p-3 text-sm font-bold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-700" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* فرم ویرایش */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* نام و نام خانوادگی */}
        <div>
          <label className="block text-xs font-black text-stone-800 mb-1.5">
            نام و نام خانوادگی
          </label>
          <div className="relative">
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="مثال: آرین احمدی"
              className="w-full bg-stone-50 border-2 border-stone-900 rounded-[10px_0_10px_0] px-3.5 py-2.5 text-sm font-bold text-stone-900 focus:outline-none focus:bg-white focus:shadow-[3px_3px_0_#292827] transition-all"
            />
            <User className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* شماره موبایل */}
        <div>
          <label className="block text-xs font-black text-stone-800 mb-1.5">
            شماره موبایل
          </label>
          <div className="relative">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              readOnly
              disabled
              dir="ltr"
              className="w-full bg-stone-100 border-2 border-stone-300 rounded-[10px_0_10px_0] px-3.5 py-2.5 text-sm font-bold text-stone-500 cursor-not-allowed font-mono"
            />
            <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* تاریخ تولد */}
        <div>
          <label className="block text-xs font-black text-stone-800 mb-1.5">
            تاریخ تولد
          </label>
          <div className="relative">
            <input
              type="text"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              placeholder="مثال: ۱۳۷۸/۰۶/۱۵"
              className="w-full bg-stone-50 border-2 border-stone-900 rounded-[10px_0_10px_0] px-3.5 py-2.5 text-sm font-bold text-stone-900 focus:outline-none focus:bg-white focus:shadow-[3px_3px_0_#292827] transition-all"
            />
            <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
          </div>
        </div>

        {/* بخش تغییر رمز عبور */}
        <div className="pt-4 border-t-2 border-stone-100 space-y-4">
          <div className="font-black text-sm text-stone-900">
            تغییر رمز عبور (اختیاری)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                رمز عبور جدید
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="حداقل ۶ کاراکتر"
                  className="w-full bg-stone-50 border-2 border-stone-900 rounded-[10px_0_10px_0] px-3.5 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:bg-white focus:shadow-[3px_3px_0_#292827] transition-all"
                />
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                تکرار رمز عبور جدید
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="تکرار رمز"
                  className="w-full bg-stone-50 border-2 border-stone-900 rounded-[10px_0_10px_0] px-3.5 py-2 text-sm font-bold text-stone-900 focus:outline-none focus:bg-white focus:shadow-[3px_3px_0_#292827] transition-all"
                />
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* دکمه ذخیره */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-[#f8a41d] hover:bg-[#e69415] text-stone-950 font-black text-sm border-2 border-stone-900 rounded-[10px_0_10px_0] shadow-[3.5px_3.5px_0_#292827] transition-all active:translate-x-0.5 active:translate-y-0.5 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                <span>در حال ذخیره...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>ذخیره تغییرات</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
