import * as Yup from "yup";

export const replyCommentSchema = Yup.object().shape({
  text: Yup.string()
    .trim()
    .min(2, "متن پاسخ باید حداقل ۲ کاراکتر باشد")
    .max(2000, "متن پاسخ نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد")
    .required("وارد کردن متن پاسخ الزامی است"),
});

export const newCourseCommentSchema = Yup.object().shape({
  text: Yup.string()
    .trim()
    .min(3, "متن دیدگاه یا اطلاعیه باید حداقل ۳ کاراکتر باشد")
    .max(2000, "متن دیدگاه نمی‌تواند بیشتر از ۲۰۰۰ کاراکتر باشد")
    .required("وارد کردن متن دیدگاه الزامی است"),
  type: Yup.string()
    .oneOf(["qa", "review"], "نوع دیدگاه نامعتبر است")
    .default("qa")
    .required("انتخاب بخش دیدگاه الزامی است"),
});
