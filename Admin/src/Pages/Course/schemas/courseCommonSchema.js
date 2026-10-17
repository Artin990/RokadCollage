import * as Yup from "yup";
import { safeTextRegex } from "../../../Constants/validationRules";

export { safeTextRegex };

export const categoryOptions = [
  { value: "فناوری اطلاعات", label: "فناوری اطلاعات" },
  { value: "گرافیک", label: "گرافیک" },
  { value: "زبان", label: "زبان" },
  { value: "MBA", label: "MBA" },
  { value: "مشاوره", label: "مشاوره" },
];

export const commonCourseFields = {
  category: Yup.string()
    .oneOf(["فناوری اطلاعات", "گرافیک", "زبان", "MBA", "مشاوره"], "انتخاب دسته‌بندی معتبر الزامی است")
    .required("انتخاب دسته‌بندی دوره الزامی است"),
  title: Yup.string()
    .matches(safeTextRegex, "عنوان نباید شامل کاراکترهای خاص باشد")
    .required("وارد کردن عنوان دوره الزامی است"),
  duration: Yup.string()
    .matches(safeTextRegex, "مدت دوره نباید شامل کاراکترهای غیرمجاز باشد")
    .required("وارد کردن مدت دوره الزامی است"),
  price: Yup.number()
    .min(0, "قیمت دوره نمی‌تواند منفی باشد")
    .nullable()
    .transform((curr, orig) => (orig === "" ? 0 : curr)),
  description: Yup.string()
    .min(5, "توضیحات باید حداقل ۵ کاراکتر باشد")
    .required("وارد کردن توضیحات دوره الزامی است"),
  tags: Yup.array().of(Yup.string()),
  teachers: Yup.array().of(Yup.string()),
  timedDiscount: Yup.object({
    percentage: Yup.number().min(0, "حداقل درصد ۰ است").max(100, "حداکثر درصد ۱۰۰ است").nullable(),
    startDate: Yup.string().nullable(),
    endDate: Yup.string().nullable(),
  }),
  discountCodes: Yup.array().of(
    Yup.object({
      code: Yup.string().trim().required("وارد کردن کد تخفیف الزامی است"),
      title: Yup.string().nullable(),
      percentage: Yup.number()
        .typeError("درصد تخفیف باید یک عدد باشد")
        .min(0, "حداقل درصد ۰ است")
        .max(100, "حداکثر درصد ۱۰۰ است")
        .required("وارد کردن درصد تخفیف الزامی است"),
      startDate: Yup.string().nullable(),
      endDate: Yup.string().nullable(),
      isActive: Yup.boolean().default(true),
    })
  ),
  sprints: Yup.array().of(
    Yup.object({
      title: Yup.string().required("وارد کردن عنوان اسپرینت الزامی است"),
      description: Yup.string().required("وارد کردن توضیحات اسپرینت الزامی است"),
    })
  ),
};

export const imgCreateValidation = Yup.mixed()
  .required("انتخاب تصویر دوره الزامی است")
  .test(
    "fileSize",
    "حجم فایل تصویر نباید بیشتر از ۵ مگابایت باشد",
    (val) => !val || !(val instanceof File) || val.size <= 5 * 1024 * 1024
  );

export const imgUpdateValidation = Yup.mixed()
  .nullable()
  .test(
    "fileSize",
    "حجم فایل تصویر نباید بیشتر از ۵ مگابایت باشد",
    (val) => !val || !(val instanceof File) || val.size <= 5 * 1024 * 1024
  );
