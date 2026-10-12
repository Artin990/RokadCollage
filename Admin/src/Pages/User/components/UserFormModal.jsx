import React, { useState } from "react";
import { useFormik } from "formik";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { createUser, updateUser } from "../api/userApi";
import { userValidationSchema } from "../schemas/userSchema";
import { normalizeBirthDate } from "../../../Constants/validationRules";
import Notify from "../../../Utils/notify";
import { Button, Input, Select, Modal } from "../../../Components/UI";

export default function UserFormModal({
  isOpen,
  onClose,
  user = null, // null for create mode, object for edit mode
  onSuccess,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = Boolean(user && user._id);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      password: "",
      birthDate: user?.birthDate || "",
      role: user?.role || "user",
    },
    validationSchema: userValidationSchema(isEdit),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = {
          fullName: values.fullName ? values.fullName.trim() : "",
          phoneNumber: normalizePersianDigits(values.phoneNumber.trim()),
          birthDate: values.birthDate ? normalizeBirthDate(values.birthDate) : "",
          role: values.role,
        };

        if (values.password && values.password.trim()) {
          payload.password = values.password.trim();
        }

        const res = isEdit
          ? await updateUser(user._id, payload)
          : await createUser(payload);

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
        Notify.error(err.response?.data?.message || err.message || "خطا در برقراری ارتباط");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const roleOptions = [
    { value: "user", label: "دانش‌آموز / کاربر عادی" },
    { value: "admin", label: "مدیر آموزشگاه" },
    { value: "superAdmin", label: "مدیر ارشد سیستم" },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? `ویرایش اطلاعات «${user.fullName || user.phoneNumber}»` : "ایجاد کاربر جدید"}
      maxWidth="max-w-lg"
    >
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
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
            value={formik.values.role || "user"}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            options={roleOptions}
            error={formik.touched.role && formik.errors.role}
          />

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-border/80 mt-2">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              انصراف
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isEdit ? "ذخیره تغییرات" : "ایجاد کاربر"}
            </Button>
          </div>
        </form>
    </Modal>
  );
}
