import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import axiosInstance from "../../../Utils/axiosInstance";
import Notify from "../../../Utils/notify";
import { Button, Input, Select } from "../../../Components/UI";

const safeTextRegex = /^[\u0600-\u06FF\sA-Za-z0-9\-\_،؛؟!.:«»",;?()\u200c\u200d]+$/;
const iranPhoneRegex = /^(\+98|0)?9\d{9}$/;

export default function UserFormModal({
  isOpen,
  onClose,
  user = null, // null for create mode, object for edit mode
  onSuccess,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = Boolean(user && user._id);

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .matches(safeTextRegex, "نام شامل کاراکترهای غیرمجاز است")
      .nullable(),
    phoneNumber: Yup.string()
      .matches(iranPhoneRegex, "شماره موبایل نامعتبر است (مثال: ۰۹۱۲۳۴۵۶۷۸۹)")
      .required("وارد کردن شماره موبایل الزامی است"),
    password: Yup.string().test(
      "password-validation",
      "رمز عبور باید حداقل ۶ کاراکتر باشد",
      (val) => {
        if (!val || val.trim() === "") return true; // optional in edit, or empty
        return val.length >= 6;
      }
    ),
    birthDate: Yup.string()
      .matches(safeTextRegex, "تاریخ تولد شامل کاراکترهای غیرمجاز است")
      .nullable(),
    role: Yup.string()
      .oneOf(["user", "admin", "superAdmin"], "نقش کاربر نامعتبر است")
      .required("انتخاب نقش کاربر الزامی است"),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      password: "",
      birthDate: user?.birthDate || "",
      role: user?.role || "user",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = {
          fullName: values.fullName ? values.fullName.trim() : "",
          phoneNumber: values.phoneNumber.trim(),
          birthDate: values.birthDate ? values.birthDate.trim() : "",
          role: values.role,
        };

        if (values.password && values.password.trim()) {
          payload.password = values.password.trim();
        }

        let res;
        if (isEdit) {
          res = await axiosInstance.patch(`user/${user._id}`, payload);
        } else {
          res = await axiosInstance.post("user", payload);
        }

        if (res && res.success !== false) {
          Notify.success(
            isEdit
              ? "اطلاعات کاربر با موفقیت بروزرسانی شد"
              : "کاربر جدید با موفقیت ایجاد شد"
          );
          if (onSuccess) onSuccess(res.data);
          onClose();
        } else {
          Notify.error(res?.message || "عملیات با خطا مواجه شد");
        }
      } catch (err) {
        console.error("Error saving user:", err);
        Notify.error(err.response?.data?.message || err.message || "خطا در برقراری ارتباط");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (!isOpen) return null;

  const roleOptions = [
    { value: "user", label: "دانش‌آموز / کاربر عادی" },
    { value: "admin", label: "مدیر آموزشگاه" },
    { value: "superAdmin", label: "مدیر ارشد سیستم" },
  ];

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-surface rounded-2xl border border-border/80 shadow-2xl overflow-hidden my-6 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary-light text-primary flex items-center justify-center">
              {isEdit ? (
                <EditOutlinedIcon fontSize="small" />
              ) : (
                <PersonAddOutlinedIcon fontSize="small" />
              )}
            </div>
            <h3 className="text-sm md:text-base font-extrabold text-secondary">
              {isEdit ? `ویرایش اطلاعات «${user.fullName || user.phoneNumber}»` : "ایجاد کاربر جدید"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary p-1.5 rounded-xl hover:bg-surface-hover transition-colors cursor-pointer"
            title="انصراف"
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={formik.handleSubmit} className="p-6 flex flex-col gap-4">
          <Input
            label="نام و نام خانوادگی"
            name="fullName"
            placeholder="مثال: علی رضایی"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.fullName && formik.errors.fullName}
          />

          <Input
            label="شماره موبایل (جهت ورود به سیستم)"
            name="phoneNumber"
            placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
            dir="ltr"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && formik.errors.phoneNumber}
            helperText="شماره همراه معتبر ۱۱ رقمی وارد شود"
          />

          <Input
            label={isEdit ? "رمز عبور جدید (اختیاری)" : "رمز عبور اولیه"}
            name="password"
            type="password"
            placeholder={
              isEdit
                ? "در صورت تمایل به تغییر رمز عبور، وارد کنید"
                : "حداقل ۶ کاراکتر (در صورت خالی ماندن، ورود با OTP خواهد بود)"
            }
            dir="ltr"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.password && formik.errors.password}
            helperText={
              isEdit
                ? "اگر نمی‌خواهید رمز عبور کاربر تغییر کند، این فیلد را خالی بگذارید."
                : "کاربر می‌تواند با این رمز عبور یا با کد پیامکی وارد شود."
            }
          />

          <Input
            label="تاریخ تولد (اختیاری)"
            name="birthDate"
            placeholder="مثال: ۱۳۷۸/۰۵/۱۲"
            value={formik.values.birthDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.birthDate && formik.errors.birthDate}
          />

          <Select
            label="نقش و سطح دسترسی کاربر"
            name="role"
            value={formik.values.role}
            onChange={(val) => formik.setFieldValue("role", val)}
            options={roleOptions}
            error={formik.touched.role && formik.errors.role}
          />

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/80 mt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
            >
              {isEdit ? "ذخیره تغییرات" : "ایجاد کاربر"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
