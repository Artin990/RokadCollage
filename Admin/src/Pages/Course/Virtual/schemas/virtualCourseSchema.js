import * as Yup from "yup";
import {
  commonCourseFields,
  imgCreateValidation,
  imgUpdateValidation,
} from "../../schemas/courseCommonSchema";
import { hex24Regex } from "../../../../Constants/validationRules";

export const virtualSpecificSchemaFields = {
  spotplayerCourseId: Yup.string()
    .trim()
    .matches(hex24Regex, "شناسه دوره در اسپات‌پلییر باید یک رشته هگز ۲۴ کاراکتری باشد")
    .required("وارد کردن شناسه دوره در اسپات‌پلییر الزامی است"),
};

export const virtualCourseValidationSchema = Yup.object({
  ...commonCourseFields,
  ...virtualSpecificSchemaFields,
  img: imgCreateValidation,
});

export const virtualCourseUpdateSchema = Yup.object({
  ...commonCourseFields,
  ...virtualSpecificSchemaFields,
  img: imgUpdateValidation,
});
