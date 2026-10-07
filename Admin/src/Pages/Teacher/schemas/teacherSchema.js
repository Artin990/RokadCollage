import * as Yup from "yup";
import { safeTextRegex } from "../../../Constants/validationRules";

export const teacherValidationSchema = Yup.object({
  name: Yup.string()
    .matches(safeTextRegex, "نام نباید شامل کاراکترهای خاص باشد")
    .required("وارد کردن نام استاد الزامی است"),
  specialization: Yup.string()
    .matches(safeTextRegex, "تخصص نباید شامل کاراکترهای خاص باشد")
    .required("وارد کردن تخصص استاد الزامی است"),
  photo: Yup.mixed()
    .required("آپلود تصویر استاد الزامی است"),
});

export const teacherUpdateSchema = Yup.object({
  name: Yup.string()
    .matches(safeTextRegex, "نام نباید شامل کاراکترهای خاص باشد")
    .required("وارد کردن نام استاد الزامی است"),
  specialization: Yup.string()
    .matches(safeTextRegex, "تخصص نباید شامل کاراکترهای خاص باشد")
    .required("وارد کردن تخصص استاد الزامی است"),
  photo: Yup.mixed().nullable(),
});
