import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  Check,
} from "lucide-react";
import { login } from "../../Store/Slices/authSlice";
import axiosInstance from "../../Utils/axiosInstance";
import Notify from "../../Utils/notify";
import { normalizePersianDigits, phoneRegex } from "../../Constants/validationRules";

const DEFAULT_ADMIN_PHONE = "09123456789";
const DEFAULT_ADMIN_PASSWORD = "adminPassword123";

const loginValidationSchema = Yup.object({
  phoneNumber: Yup.string()
    .required("وارد کردن شماره همراه الزامی است")
    .test(
      "valid-phone",
      "شماره همراه معتبر نیست (مثال: 09123456789)",
      (val) => {
        if (!val) return false;
        return phoneRegex.test(normalizePersianDigits(val.trim()));
      }
    ),
  password: Yup.string()
    .required("وارد کردن رمز عبور الزامی است")
    .min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [justAutofilled, setJustAutofilled] = useState(false);

  const formik = useFormik({
    initialValues: { phoneNumber: "", password: "" },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const cleanedPhone = normalizePersianDigits(values.phoneNumber.trim());
        const formattedPhone = cleanedPhone.startsWith("+98")
          ? cleanedPhone
          : cleanedPhone.replace(/^0/, "+98");

        const response = await axiosInstance.post("auth/login-password", {
          phoneNumber: formattedPhone,
          password: values.password,
        });

        if (response && response.success) {
          const userRole = response.data?.user?.role;

          if (userRole === "admin" || userRole === "superAdmin") {
            dispatch(login(response.data.token));
            Notify.success(`خوش آمدید ${response.data.user?.fullName || "مدیر گرامی"}`);
            navigate("/");
          } else {
            Notify.error("شما اجازه دسترسی به پنل مدیریت را ندارید.");
          }
        } else {
          Notify.error(response?.message || "اطلاعات ورود نامعتبر است");
        }
      } catch (error) {
        Notify.error(error.message || "خطا در برقراری ارتباط با سرور");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleQuickFill = () => {
    formik.setValues({
      phoneNumber: DEFAULT_ADMIN_PHONE,
      password: DEFAULT_ADMIN_PASSWORD,
    });
    formik.setErrors({});
    formik.setTouched({});
    setJustAutofilled(true);
    setTimeout(() => setJustAutofilled(false), 2000);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-[#f8fafd] relative overflow-hidden p-4 sm:p-6 select-none font-sans"
      dir="rtl"
    >
      {/* Subtle Ambient Decorative Lighting (Google Workspace Style) */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Glass-Elevated Card */}
      <div className="w-full max-w-[430px] bg-white rounded-3xl border border-slate-200/90 shadow-2xl shadow-slate-200/50 p-7 sm:p-9 relative z-10 transition-all">
        {/* Header / Brand Identity */}
        <div className="flex flex-col items-center text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#F8A41D] to-[#f59e0b] shadow-lg shadow-amber-500/25 flex items-center justify-center p-2.5 mb-3.5 transition-transform hover:scale-105">
            <img
              src="/Logo-Type-white.png"
              alt="لوگو کالج رکاد"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/60 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F8A41D]" />
            <span className="text-[11px] font-bold text-amber-800">پیشخوان مدیریت کالج</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
            ورود به حساب کاربری
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
            جهت مدیریت دوره‌ها، کاربران و تنظیمات سیستم، اطلاعات ورود خود را وارد نمایید.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-4 text-right">
          {/* Phone Number Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 pr-0.5">
              <Smartphone className="w-3.5 h-3.5 text-slate-400" />
              <span>شماره همراه</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="phoneNumber"
                placeholder="09123456789"
                dir="ltr"
                autoComplete="username"
                className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-50/70 border text-sm font-sans transition-all outline-none text-left focus:bg-white placeholder:text-slate-300 placeholder:text-left ${
                  formik.touched.phoneNumber && formik.errors.phoneNumber
                    ? "border-red-400 ring-2 ring-red-400/10 focus:border-red-500"
                    : "border-slate-200 hover:border-slate-300 focus:border-[#F8A41D] focus:ring-4 focus:ring-amber-500/10"
                }`}
                {...formik.getFieldProps("phoneNumber")}
              />
            </div>
            {formik.touched.phoneNumber && formik.errors.phoneNumber && (
              <p className="text-[11px] text-red-500 font-medium pr-1 animate-fadeIn">
                {formik.errors.phoneNumber}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5 pr-0.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>رمز عبور</span>
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••••"
                dir="ltr"
                autoComplete="current-password"
                className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-50/70 border text-sm font-sans transition-all outline-none text-left focus:bg-white placeholder:text-slate-300 placeholder:text-left tracking-wider ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-400 ring-2 ring-red-400/10 focus:border-red-500"
                    : "border-slate-200 hover:border-slate-300 focus:border-[#F8A41D] focus:ring-4 focus:ring-amber-500/10"
                }`}
                {...formik.getFieldProps("password")}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer p-0.5"
                tabIndex={-1}
                aria-label={showPassword ? "مخفی کردن رمز عبور" : "نمایش رمز عبور"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password && (
              <p className="text-[11px] text-red-500 font-medium pr-1 animate-fadeIn">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Google-Style Default Admin Quick-Fill Pill */}
          <div className="pt-1">
            <div className="bg-slate-50/90 hover:bg-amber-50/40 border border-slate-200/80 hover:border-amber-200 rounded-2xl p-2.5 sm:p-3 transition-all flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] font-bold text-slate-700 truncate">
                    حساب مدیر پیش‌فرض
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-tight dir-ltr text-right truncate">
                    {DEFAULT_ADMIN_PHONE} • {DEFAULT_ADMIN_PASSWORD}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleQuickFill}
                className={`text-[11px] font-bold px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 shrink-0 cursor-pointer ${
                  justAutofilled
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-amber-500 hover:text-slate-900 hover:border-amber-400 shadow-sm"
                }`}
              >
                {justAutofilled ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>تکمیل شد</span>
                  </>
                ) : (
                  <span>تکمیل سریع</span>
                )}
              </button>
            </div>
          </div>

          {/* Primary Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-gradient-to-r from-[#F8A41D] to-[#ea9010] hover:from-[#ea9010] hover:to-[#d6800a] text-slate-900 font-black py-3 rounded-xl shadow-md shadow-amber-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {formik.isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                  <span>در حال اعتبارسنجی...</span>
                </>
              ) : (
                <>
                  <span>ورود به پیشخوان مدیریت</span>
                  <ArrowLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security Reassurance Footer */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-slate-400 text-[11px]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>سامانه احراز هویت امن و محافظت‌شده کالج رکاد</span>
        </div>
      </div>
    </div>
  );
}
