import mongoose from "mongoose";
import { createCourseSchema } from "../CourseCore/courseBase.js";

const inPersonSpecificFields = {
    courseType: {
        type: String,
        enum: ["دوره حضوری", "کارگاه حضوری"],
        default: "دوره حضوری",
    },
    approximateSessions: {
        type: String,
        trim: true,
        default: "",
    },
    totalHours: {
        type: String,
        trim: true,
        default: "",
    },
    scheduleDays: {
        type: String,
        trim: true,
        default: "",
    },
    tuitionPerPerson: {
        type: Number,
        default: 0,
        min: 0,
    },
    proposedTeacher: {
        type: String,
        trim: true,
        default: "",
    },
    approximateStartDate: {
        type: String,
        trim: true,
        default: "",
    },
    approximateEndDate: {
        type: String,
        trim: true,
        default: "",
    },
    joujmanEvent: {
        title: {
            type: String,
            trim: true,
            default: "رویداد پایانی و ژوژمان",
        },
        description: {
            type: String,
            trim: true,
            default: "در انتهای هر دوره، یک جلسه رسمی پروژه‌های نوجوانان با دعوت رسمی از والدین و ۲ الی ۳ نفر از اساتید متخصص در این حوزه برگزار می‌شود که باعث افزایش اعتماد اولیاء، ارزیابی دقیق فنی، سنجش برای جذب در استودیو رکاد و ایجاد حس افتخار و انگیزه در نوجوانان می‌شود.",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    location: {
        address: {
            type: String,
            trim: true,
            default: "مشهد - فرامرز عباسی ۳۳",
        },
        googleMapEmbedUrl: {
            type: String,
            trim: true,
            default: "",
        },
        neshanEmbedUrl: {
            type: String,
            trim: true,
            default: "",
        },
        baladEmbedUrl: {
            type: String,
            trim: true,
            default: "",
        },
        mapEmbedUrl: {
            type: String,
            trim: true,
            default: "",
        },
    },
};

const inPersonCourseSchema = createCourseSchema(inPersonSpecificFields, "حضوری");

// Virtual relationship to CourseSession model
inPersonCourseSchema.virtual("sessions", {
    ref: "CourseSession",
    localField: "_id",
    foreignField: "course",
});

inPersonCourseSchema.index({ teachers: 1 });

const InPersonCourse = mongoose.model("InPersonCourse", inPersonCourseSchema);
export default InPersonCourse;
