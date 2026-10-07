import * as Yup from "yup";
import { safeTextRegex } from "../../../Constants/validationRules";
import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_OPTIONS,
  MAX_BLOG_CONTENT_LENGTH,
} from "../constants/blogConstants";

export { safeTextRegex, BLOG_CATEGORY_OPTIONS as categoryOptions };

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

const baseBlogFields = {
  category: Yup.string()
    .oneOf(BLOG_CATEGORIES, "دسته‌بندی باید یکی از مقادیر معتبر تعریف‌شده باشد")
    .required("انتخاب دسته‌بندی مرتبط با دوره الزامی است"),
  title: Yup.string()
    .matches(safeTextRegex, "عنوان نباید شامل کاراکترهای خاص باشد")
    .required("وارد کردن عنوان بلاگ الزامی است"),
  description: Yup.string()
    .min(10, "توضیحات باید حداقل ۱۰ کاراکتر باشد")
    .required("وارد کردن توضیحات بلاگ الزامی است"),
};

export const blogValidationSchema = Yup.object({
  ...baseBlogFields,
  content: Yup.string()
    .max(
      MAX_BLOG_CONTENT_LENGTH,
      `حجم محتوای مقاله نمی‌تواند بیشتر از ${MAX_BLOG_CONTENT_LENGTH.toLocaleString("fa-IR")} کاراکتر باشد`
    )
    .required("وارد کردن محتوای HTML مقاله الزامی است"),
  img: Yup.mixed()
    .required("انتخاب تصویر شاخص بلاگ الزامی است")
    .test(
      "fileSize",
      "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      (val) => !val || !(val instanceof File) || val.size <= MAX_IMAGE_SIZE
    ),
});

export const blogUpdateSchema = Yup.object({
  ...baseBlogFields,
  content: Yup.string()
    .max(
      MAX_BLOG_CONTENT_LENGTH,
      `حجم محتوای مقاله نمی‌تواند بیشتر از ${MAX_BLOG_CONTENT_LENGTH.toLocaleString("fa-IR")} کاراکتر باشد`
    )
    .required("محتوای HTML مقاله نمی‌تواند خالی باشد"),
  img: Yup.mixed()
    .nullable()
    .test(
      "fileSize",
      "حجم فایل نباید بیشتر از ۵ مگابایت باشد",
      (val) => !val || !(val instanceof File) || val.size <= MAX_IMAGE_SIZE
    ),
});
