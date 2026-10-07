import * as Yup from "yup";
import {
  commonCourseFields,
  iconCreateValidation,
  iconUpdateValidation,
} from "../../shared/courseCommonSchema";

export const sessionItemSchema = Yup.object().shape({
  code: Yup.string().trim().required("کد کلاس الزامی است"),
  scheduleDays: Yup.string().trim().required("روزهای برگزاری الزامی است"),
  scheduleHours: Yup.string().trim().required("ساعت برگزاری الزامی است"),
  capacity: Yup.number()
    .typeError("ظرفیت باید عدد باشد")
    .min(1, "ظرفیت حداقل باید ۱ نفر باشد")
    .required("ظرفیت الزامی است"),
});

export const inPersonSpecificSchemaFields = {
  location: Yup.object().shape({
    address: Yup.string().trim().required("آدرس محل برگزاری الزامی است"),
    googleMapEmbedUrl: Yup.string().nullable(),
    neshanEmbedUrl: Yup.string().nullable(),
    baladEmbedUrl: Yup.string().nullable(),
    mapEmbedUrl: Yup.string().nullable(),
  }),
};

export const inPersonCourseValidationSchema = Yup.object({
  ...commonCourseFields,
  ...inPersonSpecificSchemaFields,
  sessions: Yup.array()
    .of(sessionItemSchema)
    .min(1, "حداقل یک کد کلاس برای دوره حضوری الزامی است"),
  icon: iconCreateValidation,
});

export const inPersonCourseUpdateSchema = Yup.object({
  ...commonCourseFields,
  ...inPersonSpecificSchemaFields,
  icon: iconUpdateValidation,
});
