import * as Yup from "yup";
import {
  commonCourseFields,
  iconCreateValidation,
  iconUpdateValidation,
} from "../../shared/courseCommonSchema";

const hex24Regex = /^[0-9a-fA-F]{24}$/;

export const virtualSpecificSchemaFields = {
  spotplayerCourseId: Yup.string()
    .trim()
    .matches(hex24Regex, "شناسه دوره در اسپات‌پلییر باید یک رشته هگز ۲۴ کاراکتری باشد")
    .required("وارد کردن شناسه دوره در اسپات‌پلییر الزامی است"),
};

export const virtualCourseValidationSchema = Yup.object({
  ...commonCourseFields,
  ...virtualSpecificSchemaFields,
  icon: iconCreateValidation,
});

export const virtualCourseUpdateSchema = Yup.object({
  ...commonCourseFields,
  ...virtualSpecificSchemaFields,
  icon: iconUpdateValidation,
});
