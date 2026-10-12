import * as Yup from "yup";
import { safeTextRegex } from "../../../Constants/validationRules";

export const seoSchema = Yup.object({
  title: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای غیرمجاز در عنوان مجاز نیست")
    .required("وارد کردن عنوان سایت الزامی است"),
  description: Yup.string()
    .matches(safeTextRegex, "استفاده از کاراکترهای غیرمجاز در توضیحات مجاز نیست")
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .required("وارد کردن توضیحات سایت الزامی است"),
  keywords: Yup.string().nullable().notRequired().test(
    "safe-keywords",
    "استفاده از کاراکترهای غیرمجاز در کلمات کلیدی مجاز نیست",
    (val) => !val || safeTextRegex.test(val)
  ),
  robots: Yup.string().nullable().notRequired(),
  canonicalUrl: Yup.string().nullable().notRequired(),
  ogTitle: Yup.string().nullable().notRequired().test(
    "safe-ogTitle",
    "استفاده از کاراکترهای غیرمجاز مجاز نیست",
    (val) => !val || safeTextRegex.test(val)
  ),
  ogDescription: Yup.string().nullable().notRequired().test(
    "safe-ogDescription",
    "استفاده از کاراکترهای غیرمجاز مجاز نیست",
    (val) => !val || safeTextRegex.test(val)
  ),
  ogImage: Yup.string().nullable().notRequired(),
  ogType: Yup.string().nullable().notRequired(),
  twitterCard: Yup.string().nullable().notRequired(),
  twitterTitle: Yup.string().nullable().notRequired().test(
    "safe-twitterTitle",
    "استفاده از کاراکترهای غیرمجاز مجاز نیست",
    (val) => !val || safeTextRegex.test(val)
  ),
  twitterDescription: Yup.string().nullable().notRequired().test(
    "safe-twitterDescription",
    "استفاده از کاراکترهای غیرمجاز مجاز نیست",
    (val) => !val || safeTextRegex.test(val)
  ),
  twitterImage: Yup.string().nullable().notRequired(),
});
