import * as Yup from "yup";
import { safeTextRegex, objectIdRegex } from "../../../Constants/validationRules";

export const commentValidationSchema = Yup.object({
  course: Yup.string()
    .matches(objectIdRegex, "انتخاب دوره معتبر الزامی است")
    .required("انتخاب دوره مرتبط الزامی است"),
  name: Yup.string()
    .matches(safeTextRegex, "نام شامل کاراکترهای غیرمجاز است")
    .required("وارد کردن نام نویسنده نظر الزامی است"),
  role: Yup.string()
    .matches(safeTextRegex, "نقش شامل کاراکترهای غیرمجاز است")
    .required("وارد کردن نقش فرد الزامی است (مثال: هنرجوی دوره گرافیک)"),
  job: Yup.string()
    .nullable()
    .notRequired()
    .test(
      "safe-job",
      "شغل شامل کاراکترهای غیرمجاز است",
      (val) => !val || safeTextRegex.test(val)
    ),
  comment: Yup.string()
    .min(3, "متن نظر باید حداقل ۳ کاراکتر باشد")
    .required("وارد کردن متن نظر الزامی است"),
  img: Yup.mixed().nullable().notRequired(),
});
