import mongoose from "mongoose";
import { createCourseSchema } from "../CourseCore/courseBase.js";

const inPersonSpecificFields = {
    location: {
        address: {
            type: String,
            trim: true,
            default: "",
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
