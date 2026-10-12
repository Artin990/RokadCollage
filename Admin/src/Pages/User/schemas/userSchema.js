import * as Yup from "yup";
import {
  safeTextRegex,
  phoneRegex as iranPhoneRegex,
  birthDateRegex,
  normalizePersianDigits,
} from "../../../Constants/validationRules";

export const userValidationSchema = (isEdit = false) =>
  Yup.object({
    fullName: Yup.string()
      .nullable()
      .notRequired()
      .test(
        "fullName-safe",
        "نام شامل کاراکترهای غیرمجاز است",
        (val) => {
          if (!val || val.trim() === "") return true;
          return safeTextRegex.test(val.trim());
        }
      ),
    phoneNumber: Yup.string()
      .required("وارد کردن شماره موبایل الزامی است")
      .test(
        "valid-phone",
        "شماره موبایل نامعتبر است (مثال: ۰۹۱۲۳۴۵۶۷۸۹)",
        (val) => {
          if (!val || val.trim() === "") return false;
          return iranPhoneRegex.test(normalizePersianDigits(val.trim()));
        }
      ),
    password: Yup.string().test(
      "password-validation",
      "رمز عبور باید حداقل ۶ کاراکتر باشد",
      (val) => {
        if (isEdit && (!val || val.trim() === "")) return true;
        if (!isEdit && (!val || val.trim() === "")) return false;
        return val ? val.length >= 6 : false;
      }
    ),
    birthDate: Yup.string()
      .nullable()
      .notRequired()
      .test(
        "birthDate-format",
        "فرمت تاریخ تولد باید به صورت سال/ماه/روز باشد (مثال: ۱۳۸۰/۰۵/۱۲)",
        (val) => {
          if (!val || val.trim() === "") return true;
          return birthDateRegex.test(val.trim());
        }
      ),
    role: Yup.string()
      .oneOf(["user", "admin", "superAdmin"], "نقش کاربری نامعتبر است")
      .required("انتخاب سطح دسترسی الزامی است"),
  });
